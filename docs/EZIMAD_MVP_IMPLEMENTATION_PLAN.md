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

`getPublicStats()` : `countDocuments` + agrégation `$unwind productInterests`. Mise en cache `unstable_cache` (tag `ezimad-public-stats`, revalidation 60 s) et invalidation par tag après inscription / changement d'intérêt.

## 8. Flux utilisateur

1. Arrivée sur `/cm` → hero, tableau « Objectif / Réalisé » réel, CTA « Je m'inscris gratuitement ».
2. Étape 1 : prénom, WhatsApp, email (option), entreprise (combobox searchable + saisie libre), zone (préremplie par l'entreprise), catégories, consentement.
3. Succès → message « Inscription enregistrée » ou « Vous étiez déjà inscrit, informations mises à jour » (doublon) → cookie posé.
4. Étape 2 : « Quels produits souhaitez-vous acheter moins cher ? » — cartes avec bouton « Je suis intéressé » (toggle persistant, optimiste, avec rollback en cas d'erreur) + nombre réel d'intéressés.
5. Section partenaires → « Devenir partenaire » → formulaire → confirmation.

## 9. Lots

| # | Lot | Critère d'acceptation | Statut |
|---|---|---|---|
| 1 | Audit + plan | Ce fichier existe | DONE |
| 2 | Fondations, design system, structure | `npm run dev` affiche la page, tokens définis | TODO |
| 3 | Mongo + index + validations | Connexion OK, collections `ezimad_*` | TODO |
| 4 | Données entreprises / zones / catalogue | Une seule source remplaçable | TODO |
| 5 | Landing + compteur réel | Compteur = `countDocuments` | TODO |
| 6 | Inscription étape 1 | Création + doublon idempotent | TODO |
| 7 | Intérêts étape 2 | Toggle persistant sans doublon | TODO |
| 8 | Partenaires | Lead enregistré | TODO |
| 9 | Responsive, a11y, SEO, erreurs | Mobile + desktop propres | TODO |
| 10 | Typecheck / lint / build | 0 erreur | TODO |
| 11 | README + `.env.example` | Lancement local documenté | TODO |

## 10. Risques / décisions

- **Liste officielle des entreprises MAGZI non fournie** : `src/data/magzi-companies.ts` est prêt à la recevoir. Seules des entrées marquées `temporary: true` existent (masquées en production) ; la saisie libre reste possible.
- **Zones MAGZI** : liste à valider par l'équipe métier.
- **Prix indicatifs** non fournis : champ `indicativePrice` prévu dans le catalogue, non affiché tant qu'il est `null`.
- **Réinscription avec le numéro d'un tiers** : sans OTP, quelqu'un qui connaît un numéro peut modifier les intérêts associés. Risque accepté pour le MVP (données peu sensibles) ; un OTP WhatsApp pourra être ajouté.
- Base partagée : préfixe `ezimad_` obligatoire sur toute nouvelle collection.
