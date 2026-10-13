/**
 * Catégories de produits proposées aux salariés (liste de la page et étape 2 de l'inscription).
 *
 * Les ids sont stockés en base (`ezimad_employees.categories`) : ne pas les renommer,
 * en ajouter de nouveaux. Photos carrées servies depuis `public/categories/`.
 */

export type Category = {
  id: string;
  title: string;
  /** Produits de la catégorie, affichés en sous-titre. */
  products: string;
  image: string;
  imageAlt: string;
};

export const CATEGORIES = [
  {
    id: "alimentation",
    title: "Épicerie et produits alimentaires",
    products: "Huile, farine, pâtes alimentaires, chocolat, café, lait en poudre, condiments.",
    image: "/categories/alimentation.jpg",
    imageAlt: "Bouteilles d’huile de cuisson",
  },
  {
    id: "hygiene",
    title: "Hygiène et entretien",
    products: "Savons de ménage, savons de toilette, détergents, lessive, produits de nettoyage.",
    image: "/categories/hygiene.jpg",
    imageAlt: "Lessive liquide versée dans un bouchon doseur",
  },
  {
    id: "boissons",
    title: "Boissons non alcoolisées",
    products: "Eaux minérales, jus, boissons gazeuses, boissons lactées longue conservation.",
    image: "/categories/boissons.jpg",
    imageAlt: "Bouteilles d’eau minérale alignées",
  },
  {
    id: "maison",
    title: "Plastiques et équipements ménagers",
    products: "Bassines, seaux, bidons, boîtes de conservation, petits équipements domestiques.",
    // Photo provisoire : à remplacer par une photo de bassines et seaux.
    image: "/categories/maison.jpg",
    imageAlt: "Marmite posée sur un plan de travail",
  },
  {
    id: "construction",
    title: "Construction et amélioration de l’habitat",
    products: "Ciment, peinture, tôles, fers à béton et accessoires.",
    // Photo CC0 : Ekeleme Ijeoma, Wikimedia Commons.
    image: "/categories/construction.jpg",
    imageAlt: "Sacs de ciment chargés sur un camion",
  },
] as const satisfies readonly Category[];

export type CategoryId = (typeof CATEGORIES)[number]["id"];
export const CATEGORY_IDS = CATEGORIES.map((c) => c.id) as [CategoryId, ...CategoryId[]];

export const COMMUNITY_GOAL = 2000;
