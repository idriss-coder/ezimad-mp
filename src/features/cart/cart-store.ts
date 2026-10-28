"use client";

import { useSyncExternalStore } from "react";

import { findProduct, maxQuantity, PRODUCTS, type Product } from "@/data/catalog";

/** Panier : id produit → quantité. Gardé dans le navigateur (localStorage), propre à chaque appareil. */
export type CartItems = Record<string, number>;

export type CartLine = { product: Product; quantity: number };

const STORAGE_KEY = "ezimad-cart";
const EMPTY: CartItems = {};

let items: CartItems = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

/** Ignore les produits inconnus ou épuisés et ramène chaque quantité dans les bornes autorisées. */
function sanitize(raw: unknown): CartItems {
  if (!raw || typeof raw !== "object") return EMPTY;
  const clean: CartItems = {};
  for (const [id, quantity] of Object.entries(raw)) {
    const product = findProduct(id);
    if (!product || typeof quantity !== "number" || !Number.isFinite(quantity)) continue;
    const bounded = Math.min(Math.floor(quantity), maxQuantity(product));
    if (bounded > 0) clean[id] = bounded;
  }
  return clean;
}

function load() {
  if (loaded) return;
  loaded = true;
  try {
    items = sanitize(JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "null"));
  } catch {
    items = EMPTY;
  }
}

function commit(next: CartItems) {
  items = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Navigation privée ou stockage bloqué : le panier vit le temps de la page.
  }
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  // Panier modifié dans un autre onglet.
  const onStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY) return;
    loaded = false;
    load();
    listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot() {
  load();
  return items;
}

export function useCartItems() {
  return useSyncExternalStore(subscribe, getSnapshot, () => EMPTY);
}

/** Fixe la quantité d'un produit ; 0 le retire du panier. */
export function setQuantity(productId: string, quantity: number) {
  load();
  const product = findProduct(productId);
  if (!product) return;
  const next = { ...items };
  const bounded = Math.min(Math.max(0, Math.floor(quantity)), maxQuantity(product));
  if (bounded > 0) next[productId] = bounded;
  else delete next[productId];
  commit(next);
}

export function clearCart() {
  commit(EMPTY);
}

/** Lignes du panier dans l'ordre du catalogue, avec les totaux. */
export function cartSummary(cart: CartItems) {
  const lines: CartLine[] = PRODUCTS.filter((product) => cart[product.id]).map((product) => ({
    product,
    quantity: cart[product.id],
  }));
  let count = 0;
  let total = 0;
  let marketTotal = 0;
  for (const { product, quantity } of lines) {
    count += quantity;
    total += product.targetPrice * quantity;
    marketTotal += product.marketPrice * quantity;
  }
  return { lines, count, total, savings: marketTotal - total };
}
