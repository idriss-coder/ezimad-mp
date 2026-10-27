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

/**
 * Produits non périssables du quotidien, sous les marques connues au Cameroun, affichés avec leurs prix.
 *
 * `marketPrice` : prix relevés le 27/10/2026 sur sasayez.biz (commerce en ligne, Douala) ;
 * huile d'arachide : tarif du producteur camerounais Mbiang. Ce sont les prix barrés.
 * `targetPrice` : prix EZIMAD estimé si l'objectif `COMMUNITY_GOAL` est atteint (remise de 14 à 17 %).
 * Montants en FCFA, arrondis à 25 F. Photos des emballages dans `public/products/`.
 */
export type Product = {
  id: string;
  /** Nom affiché, marque comprise. */
  name: string;
  format: string;
  categoryId: CategoryId;
  image: string;
  imageAlt: string;
  marketPrice: number;
  targetPrice: number;
};

export const PRODUCTS = [
  {
    id: "huile-raffinee",
    name: "Huile raffinée Mayor",
    format: "Bouteille de 1 L",
    categoryId: "alimentation",
    image: "/products/huile-mayor.jpg",
    imageAlt: "Bouteille d’huile raffinée Mayor de 1 litre",
    marketPrice: 1500,
    targetPrice: 1275,
  },
  {
    id: "huile-arachide",
    name: "Huile d’arachide Mbiang",
    format: "Bouteille de 1 L",
    categoryId: "alimentation",
    image: "/products/huile-arachide-mbiang.jpg",
    imageAlt: "Bouteille d’huile d’arachide Mbiang",
    marketPrice: 2100,
    targetPrice: 1800,
  },
  {
    id: "riz",
    name: "Riz blanc Broli",
    format: "Sac de 5 kg",
    categoryId: "alimentation",
    image: "/products/riz-broli.jpg",
    imageAlt: "Sac de riz blanc Broli de 5 kg",
    marketPrice: 4500,
    targetPrice: 3850,
  },
  {
    id: "sucre",
    name: "Sucre Princesse Tatie",
    format: "Paquet de 1 kg",
    categoryId: "alimentation",
    image: "/products/sucre-princesse-tatie.jpg",
    imageAlt: "Paquet de sucre blanc en poudre Princesse Tatie de 1 kg",
    marketPrice: 975,
    targetPrice: 825,
  },
  {
    id: "lait-poudre",
    name: "Lait en poudre Peak",
    format: "Boîte de 400 g",
    categoryId: "alimentation",
    image: "/products/lait-peak.jpg",
    imageAlt: "Boîte de lait en poudre Peak",
    marketPrice: 3000,
    targetPrice: 2550,
  },
  {
    id: "spaghettis",
    name: "Spaghettis Broli",
    format: "Paquet de 500 g",
    categoryId: "alimentation",
    image: "/products/spaghettis-broli.jpg",
    imageAlt: "Paquets de spaghettis Broli",
    marketPrice: 650,
    targetPrice: 550,
  },
  {
    id: "concentre-tomate",
    name: "Concentré de tomate Gino",
    format: "Boîte de 400 g",
    categoryId: "alimentation",
    image: "/products/tomate-gino.jpg",
    imageAlt: "Boîte de concentré de tomate Gino",
    marketPrice: 1100,
    targetPrice: 950,
  },
  {
    id: "savon-menage",
    name: "Savon de ménage Azur",
    format: "Lot de 10 barres de 400 g",
    categoryId: "hygiene",
    image: "/products/savon-azur.jpg",
    imageAlt: "Barre de savon de ménage Azur",
    marketPrice: 4000,
    targetPrice: 3400,
  },
  {
    id: "detergent",
    name: "Détergent Madar",
    format: "Sachet de 900 g",
    categoryId: "hygiene",
    image: "/products/detergent-madar.jpg",
    imageAlt: "Sachet de détergent en poudre Madar",
    marketPrice: 1600,
    targetPrice: 1350,
  },
  {
    id: "javel",
    name: "Eau de javel La Croix",
    format: "Bouteille de 1 L",
    categoryId: "hygiene",
    image: "/products/javel-la-croix.jpg",
    imageAlt: "Bouteille d’eau de javel La Croix",
    marketPrice: 1000,
    targetPrice: 850,
  },
  {
    id: "papier-toilette",
    name: "Papier hygiénique Sita",
    format: "Lot de 10 rouleaux",
    categoryId: "hygiene",
    image: "/products/papier-sita.jpg",
    imageAlt: "Rouleau de papier hygiénique Sita",
    marketPrice: 3000,
    targetPrice: 2550,
  },
  {
    id: "dentifrice",
    name: "Dentifrice Colgate",
    format: "Tube de 125 ml",
    categoryId: "hygiene",
    image: "/products/dentifrice-colgate.jpg",
    imageAlt: "Tube de dentifrice Colgate dans sa boîte",
    marketPrice: 1350,
    targetPrice: 1150,
  },
  {
    id: "eau-minerale",
    name: "Eau minérale Supermont",
    format: "Pack de 6 bouteilles de 1,5 L",
    categoryId: "boissons",
    image: "/products/eau-supermont.jpg",
    imageAlt: "Pack de 6 bouteilles d’eau minérale Supermont de 1,5 L",
    marketPrice: 1500,
    targetPrice: 1250,
  },
] as const satisfies readonly Product[];
