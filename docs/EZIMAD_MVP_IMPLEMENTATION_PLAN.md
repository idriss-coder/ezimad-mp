# EZIMAD-MP — Plan d'implémentation MVP (vitrine)

> Source de vérité de la tâche. Mise à jour au fil des lots.

## 0. Périmètre arbitré (décision produit du 2026-10-07)

Le brief initial (`EZIMAD-MP_Claude_Code_Prompt.md`) a été **réduit volontairement** :

- ✅ **Uniquement la partie utilisateur** : landing `/cm` fonctionnelle (inscription, intérêts produits, partenaires, compteur réel).
- ❌ **Pas de back-office** (`/admin`, KPI, export CSV) pour l'instant.
- ❌ **Pas de tests end-to-end**, pas de mécanisme complexe.
- Base MongoDB **partagée** avec un autre projet (`solarity-green`) → **toutes les collections sont préfixées `ezimad_`** pour éviter tout chevauchement.

Le code reste structuré pour ajouter le back-office plus tard sans réécriture (données et agrégations déjà isolées dans `features/`).

## 1. État initial du repository

Dossier vide (greenfield). Aucune convention existante → stack recommandée par le brief.

## 2. Architecture retenue

| Choix | Justification |
|---|---|
| Next.js 16 App Router, TypeScript strict | Stack du brief, Server Components + Server Actions natifs |
| Tailwind CSS v4 + shadcn/ui | Primitives accessibles (Popover, Command pour le combobox) |
| Driver officiel `mongodb` | Pas d'ORM nécessaire pour 2 collections |
| Zod | Schémas partagés client / serveur |
| React Hook Form | Formulaires multi-champs avec erreurs par champ |
| `libphonenumber-js` | Normalisation E.164 des numéros camerounais |
| Cookie signé HMAC (`node:crypto`) | Associe l'étape 2 au bon salarié sans dépendance d'auth |

Pas d'architecture hexagonale, pas de repository pattern : chaque feature contient son schéma, son action serveur et ses composants.

## 3. Routes

| Route | Rôle |
|---|---|
| `/` | Redirection vers `/cm` |
| `/cm` | Landing unique mobile-first |

## 4. Organisation

```text
src/
  app/            layout, page racine (redirect), cm/page.tsx
  components/ui/  primitives shadcn
  components/shared/ éléments de mise en page (header, footer, section)
  features/
    registration/      schéma, action, formulaire étape 1, cookie de session
    product-interest/  action toggle, grille de cartes (étape 2)
    partner-leads/     schéma, action, formulaire
    public-stats/      agrégations + cache, tableau de progression, classement demande
  lib/db/          client Mongo + noms de collections + index
  lib/             phone, session (HMAC), utils
  data/            magzi-companies.ts, catalog.ts
```

## 5. Modèle de données (collections préfixées)

### `ezimad_employees`
`_id, firstName, phone (E.164), email?, companyId?, companyName, magziZone, categories[], productInterests[], consentAt, source?, utm?, createdAt, updatedAt`

Index : `{ phone: 1 }` **unique** · `{ createdAt: -1 }`.

### `ezimad_partner_leads`
`_id, company, contactName, phone, email?, products, publicPrice?, monthlyCapacity?, discount?, message?, createdAt`

Index : `{ createdAt: -1 }`.

Index créés de façon idempotente au premier accès (promesse mémorisée par process).

## 6. Validation, déduplication, sécurité

- Zod côté client **et** serveur ; le serveur ne fait jamais confiance au client.
- Téléphone normalisé E.164 (`CM` par défaut) → clé de déduplication.
- Inscription = `findOneAndUpdate({ phone }, …, { upsert: true })` : réinscription idempotente ; `categories` fusionnées (`$addToSet`), `createdAt`/`consentAt` conservés (`$setOnInsert`). Course concurrente → erreur `E11000` rattrapée et rejouée.
- Étape 2 : l'identifiant du lead vient **uniquement** d'un cookie `httpOnly`, `sameSite=lax`, `secure` en production, signé HMAC-SHA256 (`EZIMAD_SESSION_SECRET`). Aucun id envoyé par le client.
- Intérêts : `$addToSet` / `$pull` sur des ids validés contre le catalogue → pas de doublon.
- Anti-spam : champ honeypot invisible ; si rempli → réponse de succès factice, rien n'est écrit.
- Aucune PII dans les logs (seuls les codes d'erreur sont loggés).
- Compteurs publics toujours issus de la base ; si la base est indisponible, affichage « — » et jamais de valeur inventée.

## 7. Statistiques & cache

`getPublicStats()` : `countDocuments` + agrégation `$unwind productInterests`, directive `"use cache"` + `cacheLife("minutes")` + `cacheTag("ezimad-public-stats")` (Next 16, Cache Components). Les Server Actions appellent `updateTag` après inscription / changement d'intérêt (lecture immédiate de ses propres écritures).

Les blocs chiffrés (tableau, classement, étape 2) sont rendus **à la requête** (`await connection()` dans un `<Suspense>`) et lisent le cache : exécuter le driver MongoDB pendant un re-prerender déclenchait l'erreur Next « unstable value `new Date()` ». Le reste de la page est prérendu statiquement ; les fallbacks ont la même taille que le contenu (pas de saut de mise en page).

## 8. Flux utilisateur

1. Arrivée sur `/cm` → hero, tableau « Objectif / Réalisé » réel, CTA « Je m'inscris gratuitement ».
2. Étape 1 : prénom, WhatsApp, email (option), entreprise (combobox searchable + saisie libre), zone (préremplie par l'entreprise), catégories, consentement.
3. Succès → message « Inscription enregistrée » ou « Vous étiez déjà inscrit, informations mises à jour » (doublon) → cookie posé.
4. Étape 2 : « Quels produits souhaitez-vous acheter moins cher ? » — sélection multiple « Je suis intéressé » (locale) + nombre réel d'intéressés, puis « Valider mes choix » enregistre la liste en une fois → écran de succès animé (inscrit, prévenu sur WhatsApp à l'objectif) avec « Modifier mes choix ».
5. Section partenaires → « Devenir partenaire » → formulaire → confirmation.

## 9. Lots

| # | Lot | Critère d'acceptation | Statut |
|---|---|---|---|
| 1 | Audit + plan | Ce fichier existe | DONE |
| 2 | Fondations, design system, structure | `npm run dev` affiche la page, tokens définis | DONE |
| 3 | Mongo + index + validations | Connexion OK, collections `ezimad_*` | DONE |
| 4 | Données entreprises / zones / catalogue | Une seule source remplaçable | DONE |
| 5 | Landing + compteur réel | Compteur = `countDocuments` | DONE |
| 6 | Inscription étape 1 | Création + doublon idempotent | DONE |
| 7 | Intérêts étape 2 | Toggle persistant sans doublon | DONE |
| 8 | Partenaires | Lead enregistré | DONE |
| 9 | Responsive, a11y, SEO, erreurs | Mobile + desktop propres | DONE |
| 10 | Typecheck / lint / build | 0 erreur | DONE |
| 11 | README + `.env.example` | Lancement local documenté | DONE |
| 12 | Refonte visuelle (impeccable) | Page épurée : vitrine produits photo, compteur, inscription, partenaires ; textes réduits | DONE |

## 10. Risques / décisions

- **Liste officielle des entreprises MAGZI non fournie** : `src/data/magzi-companies.ts` est prêt à la recevoir. Seules des entrées marquées `temporary: true` existent (masquées en production) ; la saisie libre reste possible.
- **Zones MAGZI** : liste à valider par l'équipe métier.
- **Prix** non fournis : `publicPrice` (barré) et `memberPrice` (prix salarié) prévus dans le catalogue ; rien n'est affiché tant qu'ils valent `null` (le brief interdit d'inventer des prix).
- **Réinscription avec le numéro d'un tiers** : sans OTP, quelqu'un qui connaît un numéro peut modifier les intérêts associés. Risque accepté pour le MVP (données peu sensibles) ; un OTP WhatsApp pourra être ajouté.
- Base partagée : préfixe `ezimad_` obligatoire sur toute nouvelle collection.

## 11. Vérifications réalisées (2026-10-07)

- `tsc --noEmit` : 0 erreur · `eslint` : 0 erreur / 0 warning · `next build` : OK (`/cm` en Partial Prerender).
- Parcours réel sur le serveur de production (mobile + desktop) : landing → inscription → étape 2 → compteur public mis à jour (0 → 1).
- Réinscription du même numéro saisi dans un autre format (`699000001` / `+237 6 99 00 00 01`) → 1 seul document, catégories fusionnées, `createdAt` conservé.
- Intérêt ajouté deux fois → stocké une seule fois ; produit inconnu et entrées invalides rejetés côté serveur.
- Lead partenaire enregistré dans `ezimad_partner_leads`.
- Données de test supprimées de la base après vérification.
- Hors périmètre volontaire : back-office, export CSV, tests end-to-end.
