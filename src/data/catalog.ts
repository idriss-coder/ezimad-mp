/**
 * Catalogue de demande : catégories (étape 1) et produits représentatifs (étape 2).
 *
 * Prix : aucun prix réel n'a été fourni, ils restent donc à `null` et ne sont pas affichés.
 * Dès que `publicPrice` et `memberPrice` sont renseignés pour un produit, la carte affiche
 * le prix public barré, le prix salarié et la remise en pourcentage.
 */

export const CATEGORIES = [
  { id: "alimentation", label: "Alimentation" },
  { id: "boissons", label: "Boissons" },
  { id: "menager", label: "Produits ménagers" },
  { id: "hygiene", label: "Hygiène & soins" },
  { id: "maison", label: "Équipement maison" },
  { id: "electromenager", label: "Électroménager" },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]["id"];
export const CATEGORY_IDS = CATEGORIES.map((c) => c.id) as [CategoryId, ...CategoryId[]];

export type CatalogProduct = {
  id: string;
  name: string;
  description: string;
  categoryId: CategoryId;
  /** Photo carrée servie depuis `public/products/`. */
  image: string;
  imageAlt: string;
  /** Unité de vente à laquelle s'appliquent les prix (ex. « sac de 25 kg »). */
  unit: string | null;
  /** Prix public de référence en FCFA (affiché barré). */
  publicPrice: number | null;
  /** Prix négocié pour les salariés en FCFA. */
  memberPrice: number | null;
};

const NO_PRICE = { unit: null, publicPrice: null, memberPrice: null } as const;

export const PRODUCTS = [
  {
    id: "riz-farines",
    name: "Riz, farines & céréales",
    description: "Sacs et paquets pour la famille",
    categoryId: "alimentation",
    image: "/products/riz-farines.jpg",
    imageAlt: "Riz blanc versé à la cuillère",
    ...NO_PRICE,
  },
  {
    id: "huiles",
    name: "Huiles de cuisson",
    description: "Bidons et bouteilles",
    categoryId: "alimentation",
    image: "/products/huiles.jpg",
    imageAlt: "Bouteilles d’huile de cuisson",
    ...NO_PRICE,
  },
  {
    id: "boissons",
    name: "Eaux & boissons",
    description: "Packs et casiers",
    categoryId: "boissons",
    image: "/products/boissons.jpg",
    imageAlt: "Pack de bouteilles d’eau",
    ...NO_PRICE,
  },
  {
    id: "entretien",
    name: "Détergents & entretien",
    description: "Lessive, javel, nettoyants",
    categoryId: "menager",
    image: "/products/entretien.jpg",
    imageAlt: "Lessive liquide versée dans un bouchon doseur",
    ...NO_PRICE,
  },
  {
    id: "hygiene",
    name: "Savons & hygiène",
    description: "Savons, dentifrices, soins",
    categoryId: "hygiene",
    image: "/products/hygiene.jpg",
    imageAlt: "Pain de savon posé près d’un lavabo",
    ...NO_PRICE,
  },
  {
    id: "cuisine",
    name: "Ustensiles de cuisine",
    description: "Marmites, plastiques, vaisselle",
    categoryId: "maison",
    image: "/products/cuisine.jpg",
    imageAlt: "Marmite en fonte",
    ...NO_PRICE,
  },
  {
    id: "petit-electro",
    name: "Petit électroménager",
    description: "Ventilateurs, fers, mixeurs",
    categoryId: "electromenager",
    image: "/products/petit-electro.jpg",
    imageAlt: "Ventilateur sur pied",
    ...NO_PRICE,
  },
  {
    id: "mobilier",
    name: "Mobilier & literie",
    description: "Matelas, chaises, rangements",
    categoryId: "maison",
    image: "/products/mobilier.jpg",
    imageAlt: "Lit fait dans une chambre",
    ...NO_PRICE,
  },
] as const satisfies readonly CatalogProduct[];

export type ProductId = (typeof PRODUCTS)[number]["id"];
export const PRODUCT_IDS = PRODUCTS.map((p) => p.id) as [ProductId, ...ProductId[]];

export const COMMUNITY_GOAL = 2000;

/** Remise en pourcentage arrondie, ou `null` si les deux prix ne sont pas connus. */
export function discountPercent(product: Pick<CatalogProduct, "publicPrice" | "memberPrice">) {
  const { publicPrice, memberPrice } = product;
  if (publicPrice === null || memberPrice === null || memberPrice >= publicPrice) return null;
  return Math.round((1 - memberPrice / publicPrice) * 100);
}
