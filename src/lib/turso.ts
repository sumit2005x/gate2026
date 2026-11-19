import { createClient, Client } from "@libsql/client";

const TURSO_DATABASE_URL = process.env.TURSO_DATABASE_URL;
const TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN;

let tursoClient: Client | null = null;

if (TURSO_DATABASE_URL) {
  tursoClient = createClient({
    url: TURSO_DATABASE_URL,
    authToken: TURSO_AUTH_TOKEN,
  });
}

export function isTursoEnabled(): boolean {
  return !!tursoClient;
}

export async function initTursoSchema() {
  if (!tursoClient) return;

  try {
    await tursoClient.execute(`
      CREATE TABLE IF NOT EXISTS store_data (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
  } catch (err) {
    console.error("Failed to initialize Turso table:", err);
  }
}

export async function getTursoData(key: string): Promise<any | null> {
  if (!tursoClient) return null;

  try {
    const res = await tursoClient.execute({
      sql: "SELECT value FROM store_data WHERE key = ? LIMIT 1",
      args: [key],
    });

    if (res.rows && res.rows.length > 0) {
      return JSON.parse(res.rows[0].value as string);
    }
    return null;
  } catch (err) {
    console.error(`Error reading key ${key} from Turso:`, err);
    return null;
  }
}

export async function setTursoData(key: string, data: any): Promise<boolean> {
  if (!tursoClient) return false;

  try {
    await tursoClient.execute({
      sql: `
        INSERT INTO store_data (key, value, updated_at) 
        VALUES (?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(key) DO UPDATE SET 
          value = excluded.value,
          updated_at = CURRENT_TIMESTAMP
      `,
      args: [key, JSON.stringify(data)],
    });
    return true;
  } catch (err) {
    console.error(`Error writing key ${key} to Turso:`, err);
    return false;
  }
}
