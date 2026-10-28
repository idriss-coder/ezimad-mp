# Product

## Register

brand

## Users

Salariés des zones industrielles MAGZI (Cameroun), le plus souvent sur mobile, souvent pendant une pause ou le trajet. Ils veulent voir en quelques secondes les prix et réserver sans effort. Public secondaire : entreprises implantées en zone MAGZI qui cherchent un canal de distribution.

## Product Purpose

Faire passer les salariés à l'action : réserver dès maintenant des produits au prix EZIMAD, sans paiement initial, avant la date limite des réductions (décision client du 2026-10-28). L'équipe recontacte chaque réservation sur WhatsApp. Succès : réservation enregistrée (panier + coordonnées), puis réponse au champ libre « autres produits ». (La partie entreprises partenaires est masquée pour l'instant.)

## Brand Personality

Nostalgique, simple, franc (décision client du 2026-10-13). Le site doit ressembler à une page web « d'avant » : HTML de débutant, polices système, liens soulignés, filets gris, boutons à l'ancienne, contrastes forts. Références : Amazon classique (bandeau marine, boutons jaunes et orange en léger dégradé, liste de résultats image + titre + ligne de notation, focus orange) et les pages « compte à rebours » (titre en capitales, filet rouge, gros chiffres rouges séparés par « : », libellés sous chaque nombre).

## Anti-references

Landing pages modernes « générées par IA » : grandes typos serrées, cartes arrondies à ombres douces, glassmorphism, animations d'entrée, petits libellés en capitales au-dessus de chaque section, bavardage marketing, chiffres inventés.

## Design Principles

1. Une page, deux blocs : le compte à rebours jusqu'à la date limite des réductions en haut (avec « Pas de paiement initial requis »), la grille des produits du quotidien en dessous (une rubrique par catégorie, étoiles, prix EZIMAD avec remise, prix du marché barré, stock restant, « Ajouter au panier »). Rien d'autre.
2. Panier façon Amazon : compteur dans l'en-tête, barre « Réserver » en bas d'écran, puis tout le parcours dans une boîte de dialogue : panier → coordonnées → « réservation enregistrée » + champ libre « autres produits ». Produit épuisé : liste d'attente.
3. Urgence assumée (demande client) : date limite, stock restant, produits épuisés. Notes en étoiles et stocks sont des valeurs fixes choisies dans `src/data/catalog.ts`, identiques pour tous, jamais aléatoires à l'affichage. Prix barrés = prix réellement relevés (source et date dans `src/data/catalog.ts`).
4. Hiérarchie par la taille, la graisse et les filets, pas par la décoration.
5. Mobile d'abord : « Pas de paiement initial requis » et « Voir les produits » visibles sans défiler.

## Accessibility & Inclusion

WCAG 2.2 AA : contraste ≥ 4.5:1, focus visible, labels et erreurs liés aux champs, navigation clavier, `prefers-reduced-motion` respecté. Connexions mobiles modestes : images optimisées, page légère.
