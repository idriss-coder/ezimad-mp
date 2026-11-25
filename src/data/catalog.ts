/**
 * Catégories de produits : plus affichées sur la page (tous les produits sont dans une seule grille).
 *
 * Les ids sont stockés en base (`ezimad_employees.categories`, inscriptions de la V1) : ne pas les renommer,
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

/** Nombre maximal de packs par produit dans le panier. */
export const MAX_QUANTITY = 10;

/**
 * Catalogue de lancement : 20 produits, dont 1 masqué, vendus en pack (fichier client du 24/11/2026).
 *
 * `marketPrice` : prix du marché pour la même quantité achetée au détail (prix barré). Ce sont des références
 * fournies par le client, pas des relevés : le fichier source demande de les valider avant publication.
 * `targetPrice` : prix EZIMAD du pack. Montants en FCFA.
 * Les prix d'achat et les marges du fichier source ne doivent jamais figurer ici : ce module est envoyé au navigateur.
 *
 * Les ids sont stockés dans les réservations : ne pas les réutiliser pour un autre produit.
 * Photos carrées dans `public/products/`.
 */
export type Product = {
  id: string;
  /** Nom affiché, marque comprise. */
  name: string;
  /** Contenu du pack, affiché sous le nom. */
  format: string;
  /** Nombre d'articles dans le pack. */
  packSize: number;
  /** Nom d'un article du pack (« bidon »), pour le prix unitaire. */
  unit: string;
  image: string;
  imageAlt: string;
  /** La photo montre le produit en général, pas l’emballage réel : mention « Photo d’illustration ». */
  illustration?: boolean;
  /** Prix du marché pour tout le pack (barré). */
  marketPrice: number;
  /** Prix EZIMAD du pack. */
  targetPrice: number;
};

export const PRODUCTS = [
  {
    id: "ezm-001",
    name: "Huile alimentaire Mayor",
    format: "Pack de 4 bidons de 5 L",
    packSize: 4,
    unit: "bidon",
    image: "/products/huile-mayor-4x5l.jpg",
    imageAlt: "Pack de 4 bidons d’huile Mayor de 5 litres",
    marketPrice: 28500,
    targetPrice: 23500,
  },
  {
    id: "ezm-002",
    name: "Huile alimentaire Mayor",
    format: "Pack de 15 bouteilles de 1 L",
    packSize: 15,
    unit: "bouteille",
    image: "/products/huile-mayor-15x1l.jpg",
    imageAlt: "Carton de 15 bouteilles d’huile Mayor de 1 litre",
    marketPrice: 20805,
    targetPrice: 16900,
  },
  {
    id: "ezm-003",
    name: "Huile alimentaire Prima Palm",
    format: "Pack de 15 bouteilles de 1 L",
    packSize: 15,
    unit: "bouteille",
    image: "/products/huile-prima-palm-1l.jpg",
    imageAlt: "Bouteille d’huile Prima Palm de 1 litre",
    marketPrice: 19500,
    targetPrice: 16000,
  },
  {
    id: "ezm-004",
    name: "Savon de ménage Mayor",
    format: "Pack de 10 savons de 400 g",
    packSize: 10,
    unit: "savon",
    image: "/products/savon-mayor-400g.jpg",
    imageAlt: "Savon de ménage Mayor",
    marketPrice: 5000,
    targetPrice: 4000,
  },
  {
    id: "ezm-005",
    name: "Savon de ménage May",
    format: "Pack de 10 savons de 200 g",
    packSize: 10,
    unit: "savon",
    image: "/products/savon-may-200g.jpg",
    imageAlt: "Savon de ménage May",
    marketPrice: 2500,
    targetPrice: 2100,
  },
  {
    id: "ezm-006",
    name: "Concentré de tomates Mamy",
    format: "Pack de 50 sachets de 70 g",
    packSize: 50,
    unit: "sachet",
    image: "/products/tomate-mamy-sachet-70g.jpg",
    imageAlt: "Sachet de concentré de tomates Mamy de 70 g",
    marketPrice: 6250,
    targetPrice: 4750,
  },
  {
    id: "ezm-007",
    name: "Jus Extra Fresco",
    format: "Pack de 24 bouteilles de 330 ml",
    packSize: 24,
    unit: "bouteille",
    image: "/products/extra-fresco-orange.jpg",
    imageAlt: "Bouteille de jus d’orange Extra Fresco",
    marketPrice: 9000,
    targetPrice: 6900,
  },
  {
    id: "ezm-008",
    name: "Boisson Tam Tam",
    format: "Pack de 24 sachets de 200 ml",
    packSize: 24,
    unit: "sachet",
    image: "/products/tam-tam-ananas-200ml.jpg",
    imageAlt: "Sachet de boisson Tam Tam de 200 ml",
    marketPrice: 3600,
    targetPrice: 2800,
  },
  {
    id: "ezm-009",
    name: "Yaourt Dolait Ninou",
    format: "Pack de 5 pots de 150 g",
    packSize: 5,
    unit: "pot",
    image: "/products/dolait-ninou-fraise.jpg",
    imageAlt: "Pot de yaourt Dolait Ninou de 150 g",
    marketPrice: 1700,
    targetPrice: 1350,
  },
  {
    id: "ezm-010",
    name: "Eau minérale Supermont",
    format: "Pack de 6 bouteilles de 1,5 L",
    packSize: 6,
    unit: "bouteille",
    image: "/products/eau-supermont.jpg",
    imageAlt: "Pack de 6 bouteilles d’eau Supermont de 1,5 L",
    marketPrice: 1500,
    targetPrice: 1050,
  },
  {
    id: "ezm-011",
    name: "Super Jus Mangue",
    format: "Pack de 6 bouteilles de 1 L",
    packSize: 6,
    unit: "bouteille",
    image: "/products/super-jus-mangue-1l.jpg",
    imageAlt: "Bouteille de Super Jus Mangue de 1 litre",
    marketPrice: 3600,
    targetPrice: 2900,
  },
  {
    id: "ezm-012",
    name: "Soda Planet Orange",
    format: "Pack de 6 bouteilles de 1 L",
    packSize: 6,
    unit: "bouteille",
    image: "/products/planet-orange-1l.jpg",
    imageAlt: "Bouteille de soda Planet Orange de 1 litre",
    marketPrice: 3000,
    targetPrice: 2600,
  },
  {
    id: "ezm-013",
    name: "American Cola",
    format: "Pack de 6 bouteilles de 1 L",
    packSize: 6,
    unit: "bouteille",
    image: "/products/american-cola.jpg",
    imageAlt: "Bouteille d’American Cola",
    marketPrice: 3000,
    targetPrice: 2600,
  },
  {
    id: "ezm-014",
    name: "Naya Super Milk",
    format: "Pack de 20 sachets",
    packSize: 20,
    unit: "sachet",
    image: "/products/naya-super-milk.jpg",
    imageAlt: "Sachet de Naya Super Milk",
    marketPrice: 2500,
    targetPrice: 1900,
  },
  {
    id: "ezm-015",
    name: "Biscuit Naya Chocolat",
    format: "Pack de 24 paquets",
    packSize: 24,
    unit: "paquet",
    image: "/products/biscuit-naya-chocolat-paquet.jpg",
    imageAlt: "Paquet de biscuits Naya fourrés au chocolat",
    marketPrice: 2400,
    targetPrice: 1800,
  },
  {
    id: "ezm-016",
    name: "Biscuit Naya Olait",
    format: "Pack de 24 paquets",
    packSize: 24,
    unit: "paquet",
    image: "/products/biscuit-naya-olait-paquet.jpg",
    imageAlt: "Paquet de biscuits Naya O.lait",
    marketPrice: 1440,
    targetPrice: 1150,
  },
  {
    id: "ezm-017",
    name: "Lait La Bergère",
    format: "Pack de 20 sachets de 50 g",
    packSize: 20,
    unit: "sachet",
    image: "/products/lait-la-bergere-instant.jpg",
    imageAlt: "Sachet de lait en poudre La Bergère",
    marketPrice: 2500,
    targetPrice: 2100,
  },
  {
    id: "ezm-018",
    name: "Margarine Gusta",
    format: "Pack de 4 pots de 250 g",
    packSize: 4,
    unit: "pot",
    image: "/products/margarine-gusta.jpg",
    imageAlt: "Pot de margarine Gusta",
    marketPrice: 2600,
    targetPrice: 2100,
  },
  // ezm-019 (Riz Princesse, pack de 2 sacs de 25 kg, marché 30000, EZIMAD 26500) : masqué faute de photo du vrai sac (demande client du 2026-11-25).
  {
    id: "ezm-020",
    name: "Sucre cristallisé",
    format: "Pack de 5 sachets de 1 kg",
    packSize: 5,
    unit: "sachet",
    image: "/products/sucre-dolce-1kg.jpg",
    imageAlt: "Sachet de sucre Dolcé de 1 kg",
    marketPrice: 4500,
    targetPrice: 3900,
  },
] as const satisfies readonly Product[];

export type ProductId = (typeof PRODUCTS)[number]["id"];

export const findProduct = (id: string): Product | undefined => PRODUCTS.find((product) => product.id === id);

/** Ce que l'on économise sur un pack par rapport au prix du marché. */
export const savingsOf = (product: Product) => product.marketPrice - product.targetPrice;

/** Prix EZIMAD ramené à un article du pack, arrondi au franc. */
export const unitPriceOf = (product: Product) => Math.round(product.targetPrice / product.packSize);
