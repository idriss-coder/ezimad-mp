# EZIMAD-MP — Vitrine salariés MAGZI

Landing `/cm` qui constitue une base de demande qualifiée : inscription des salariés des zones MAGZI,
choix des produits souhaités, compteur public réel vers l'objectif de 2 000 inscrits, et formulaire
pour les entreprises partenaires. Le back-office n'est pas encore construit (voir `docs/`).

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
| `EZIMAD_SESSION_SECRET` | Secret HMAC du cookie salarié, 32+ caractères (`openssl rand -base64 48`) |
| `NEXT_PUBLIC_SITE_URL` | URL publique (métadonnées / Open Graph) |

## MongoDB

La base est **partagée avec un autre projet** : toutes les collections EZIMAD sont préfixées `ezimad_`.

- `ezimad_employees` — salariés (index unique sur `phone` en E.164, index `createdAt`)
- `ezimad_partner_leads` — demandes des entreprises partenaires (index `createdAt`)

Les index sont créés automatiquement au premier accès. Une réinscription avec le même numéro met à jour
la fiche existante (aucun doublon).

## Données métier à fournir

- `src/data/magzi-companies.ts` — liste officielle des entreprises et zones (les entrées `temporary`
  ne s'affichent qu'en développement ; la saisie libre reste toujours possible).
- `src/data/catalog.ts` — catégories, produits, photos (`public/products/`) et prix. Quand `publicPrice` et
  `memberPrice` sont renseignés, la carte affiche le prix public barré, le prix salarié et la remise ; tant qu'ils
  valent `null`, aucun prix n'est affiché.

## Déploiement Vercel

1. Importer le dépôt dans Vercel (preset Next.js, aucune configuration particulière).
2. Renseigner les variables ci-dessus dans *Settings → Environment Variables*.
3. Dans Atlas, autoriser l'accès réseau depuis Vercel (*Network Access*).
