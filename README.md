# Ezimarket — Vitrine salariés MAGZI

Landing `/cm` au style volontairement « web d'avant » (inspiré d'Amazon classique) qui constitue une base de
demande qualifiée : catalogue de produits vendus en pack (prix du marché barré, prix Ezimarket, économie), panier et
réservation sans paiement dans une boîte de dialogue, et proposition libre d'autres produits. La section entreprises partenaires est masquée (code conservé dans `src/features/partner-leads`).
Le back-office n'est pas encore construit (voir `docs/`).

## Stack

Next.js 16 (App Router, Cache Components) · TypeScript strict · Tailwind CSS v4 · shadcn/ui (Base UI)
· MongoDB (driver officiel) · Zod · React Hook Form · libphonenumber-js.

## Lancer en local

```bash
cp .env.example .env.local   # puis renseigner les valeurs
npm install
npm run dev                  # http://localhost:3000 → redirige vers /cm
```

Vérifications : `npx tsc --noEmit`, `npm run lint`, `npm run build`.

## Variables d'environnement

| Variable | Rôle |
|---|---|
| `MONGODB_URI` | Chaîne Atlas `mongodb+srv://…` (le nom de base est lu dans l'URI) |
| `MONGODB_DB` | Optionnel : nom de base si absent de l'URI |
| `NEXT_PUBLIC_SITE_URL` | URL publique (métadonnées / Open Graph) |

## MongoDB

La base est **partagée avec un autre projet** : toutes les collections Ezimarket sont préfixées `ezimad_`.

- `ezimad_employees` — salariés (index unique sur `phone` en E.164, index `createdAt`)
- `ezimad_partner_leads` — demandes des entreprises partenaires (index `createdAt`)

Les index sont créés automatiquement au premier accès. Une réinscription avec le même numéro met à jour
la fiche existante (aucun doublon) ; ses catégories sont remplacées par le dernier choix.

## Données métier à fournir

- `src/data/magzi-companies.ts` — liste officielle des entreprises et zones (les entrées `temporary`
  ne s'affichent qu'en développement ; la saisie libre reste toujours possible).
- `src/data/catalog.ts` — produits en pack (prix du marché, prix Ezimarket, photo dans `public/products/`). Les ids sont
  stockés dans les réservations : ne pas les réutiliser. `illustration: true` signale une photo
  générique : à remplacer par l'emballage réel dans `public/products/`, puis retirer le champ.

## Déploiement Vercel

1. Importer le dépôt dans Vercel (preset Next.js, aucune configuration particulière).
2. Renseigner les variables ci-dessus dans *Settings → Environment Variables*.
3. Dans Atlas, autoriser l'accès réseau depuis Vercel (*Network Access*).
