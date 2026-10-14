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
    imageAlt: "Bidon de 5 litres d’huile de palme raffinée",
  },
  {
    id: "hygiene",
    title: "Hygiène et entretien",
    products: "Savons de ménage, savons de toilette, détergents, lessive, produits de nettoyage.",
    image: "/categories/hygiene.jpg",
    imageAlt: "Assouplissant, eau de javel, lessive en poudre et savons de ménage",
  },
  {
    id: "boissons",
    title: "Boissons non alcoolisées",
    products: "Eaux minérales, jus, boissons gazeuses, boissons lactées longue conservation.",
    image: "/categories/boissons.jpg",
    imageAlt: "Bouteilles de jus, sodas et eau minérale alignées",
  },
  {
    id: "maison",
    title: "Plastiques et équipements ménagers",
    products: "Bassines, seaux, bidons, boîtes de conservation, petits équipements domestiques.",
    image: "/categories/maison.jpg",
    imageAlt: "Bassines, seaux et paniers en plastique de couleur",
  },
  {
    id: "construction",
    title: "Construction et amélioration de l’habitat",
    products: "Ciment, peinture, tôles, fers à béton et accessoires.",
    image: "/categories/construction.jpg",
    imageAlt: "Sac de ciment de 50 kg",
  },
] as const satisfies readonly Category[];

export type CategoryId = (typeof CATEGORIES)[number]["id"];
export const CATEGORY_IDS = CATEGORIES.map((c) => c.id) as [CategoryId, ...CategoryId[]];

export const COMMUNITY_GOAL = 2000;
