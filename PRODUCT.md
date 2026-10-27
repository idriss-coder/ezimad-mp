# Product

## Register

brand

## Users

Salariés des zones industrielles MAGZI (Cameroun), le plus souvent sur mobile, souvent pendant une pause ou le trajet. Ils veulent savoir en quelques secondes ce que le club leur apporte, puis s'inscrire sans effort. Public secondaire : entreprises implantées en zone MAGZI qui cherchent un canal de distribution.

## Product Purpose

Constituer une base de demande qualifiée (objectif 2 000 inscrits) pour négocier des prix préférentiels auprès des producteurs MAGZI. Succès : inscription complète et catégories de produits choisies. (La partie entreprises partenaires est masquée pour l'instant.)

## Brand Personality

Nostalgique, simple, franc (décision client du 2026-10-13). Le site doit ressembler à une page web « d'avant » : HTML de débutant, polices système, liens soulignés, filets gris, boutons à l'ancienne, contrastes forts. Références : Amazon classique (bandeau marine, boutons jaunes et orange en léger dégradé, liste de résultats image + titre + ligne de notation, focus orange) et les pages « compte à rebours » (titre en capitales, filet rouge, gros chiffres rouges séparés par « : », libellés sous chaque nombre).

## Anti-references

Landing pages modernes « générées par IA » : grandes typos serrées, cartes arrondies à ombres douces, glassmorphism, animations d'entrée, petits libellés en capitales au-dessus de chaque section, bavardage marketing, chiffres inventés.

## Design Principles

1. Une page, deux blocs : le compteur en haut, la grille des produits du quotidien en dessous (une rubrique par catégorie, prix EZIMAD estimé + prix du marché barré, bouton orange « Je veux ce prix »). Rien d'autre.
2. Tout le parcours d'inscription vit dans une boîte de dialogue : informations → catégories → « inscription réussie ».
3. Chiffres vrais ou rien : compteur et nombre de cœurs issus de la base, jamais de valeur fictive. Prix barrés = prix réellement relevés (source et date dans `src/data/catalog.ts`) ; prix EZIMAD toujours présentés comme des estimations liées à l'objectif d'inscrits.
4. Hiérarchie par la taille, la graisse et les filets, pas par la décoration.
5. Mobile d'abord : le bouton « Je m'inscris » est visible sans défiler.

## Accessibility & Inclusion

WCAG 2.2 AA : contraste ≥ 4.5:1, focus visible, labels et erreurs liés aux champs, navigation clavier, `prefers-reduced-motion` respecté. Connexions mobiles modestes : images optimisées, page légère.
