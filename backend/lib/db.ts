const DB_PATH = "./data/db.json";

type Plant = Record<string, unknown>;

type DbShape = {
  plants: Array<Plant>;
};

async function loadDb(): Promise<DbShape> {
  try {
    const text = await Deno.readTextFile(DB_PATH);
    return JSON.parse(text) as DbShape;
  } catch {
    // Fallback, falls Datei (noch) leer ist
    return { plants: [] };
  }
}

async function saveDb(db: DbShape): Promise<void> {
  const text = JSON.stringify(db, null, 2);
  await Deno.writeTextFile(DB_PATH, text);
}

export const db = { loadDb, saveDb };
