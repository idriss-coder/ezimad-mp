import { MongoClient, type Db } from "mongodb";

/**
 * Base partagée avec d'autres projets : toute collection EZIMAD
 * doit être préfixée `ezimad_`.
 */
export const COLLECTIONS = {
  employees: "ezimad_employees",
  partnerLeads: "ezimad_partner_leads",
} as const;

type GlobalMongo = { client?: Promise<MongoClient>; indexes?: Promise<void> };
const globalMongo = globalThis as typeof globalThis & { __ezimadMongo?: GlobalMongo };
const cache: GlobalMongo = (globalMongo.__ezimadMongo ??= {});

function getClient() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI manquant");
  cache.client ??= new MongoClient(uri, { maxPoolSize: 10 }).connect().catch((error) => {
    cache.client = undefined;
    throw error;
  });
  return cache.client;
}

async function ensureIndexes(db: Db) {
  await Promise.all([
    db.collection(COLLECTIONS.employees).createIndexes([
      { key: { phone: 1 }, name: "phone_unique", unique: true },
      { key: { createdAt: -1 }, name: "createdAt_desc" },
    ]),
    db.collection(COLLECTIONS.partnerLeads).createIndex({ createdAt: -1 }, { name: "createdAt_desc" }),
  ]);
}

export async function getDb() {
  const db = (await getClient()).db(process.env.MONGODB_DB || undefined);
  cache.indexes ??= ensureIndexes(db).catch((error) => {
    cache.indexes = undefined;
    throw error;
  });
  await cache.indexes;
  return db;
}
