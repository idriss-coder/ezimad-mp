"use client";

import { useSyncExternalStore } from "react";

import { findProduct, isPriced, MAX_QUANTITY, PRODUCTS, savingsOf, type Product } from "@/data/catalog";

/** Panier : id produit → nombre de packs. Gardé dans le navigateur (localStorage), propre à chaque appareil. */
export type CartItems = Record<string, number>;

export type CartLine = { product: Product; quantity: number };

const STORAGE_KEY = "ezimad-cart";
const EMPTY: CartItems = {};

let items: CartItems = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

/** Ignore les produits inconnus (ancien catalogue) et ramène chaque quantité dans les bornes autorisées. */
function sanitize(raw: unknown): CartItems {
  if (!raw || typeof raw !== "object") return EMPTY;
  const clean: CartItems = {};
  for (const [id, quantity] of Object.entries(raw)) {
    if (!findProduct(id) || typeof quantity !== "number" || !Number.isFinite(quantity)) continue;
    const bounded = Math.min(Math.floor(quantity), MAX_QUANTITY);
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
  if (!findProduct(productId)) return;
  const next = { ...items };
  const bounded = Math.min(Math.max(0, Math.floor(quantity)), MAX_QUANTITY);
  if (bounded > 0) next[productId] = bounded;
  else delete next[productId];
  commit(next);
}

export function clearCart() {
  commit(EMPTY);
}

/** Lignes du panier dans l'ordre du catalogue, avec les totaux. `unpriced` : packs au prix à confirmer, hors total. */
export function cartSummary(cart: CartItems) {
  const lines: CartLine[] = PRODUCTS.filter((product) => cart[product.id]).map((product) => ({
    product,
    quantity: cart[product.id],
  }));
  let count = 0;
  let total = 0;
  let savings = 0;
  let unpriced = 0;
  for (const { product, quantity } of lines) {
    count += quantity;
    if (!isPriced(product)) {
      unpriced += quantity;
      continue;
    }
    total += product.targetPrice * quantity;
    savings += savingsOf(product) * quantity;
  }
  return { lines, count, total, savings, unpriced };
}
