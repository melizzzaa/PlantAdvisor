import { Plant } from "../models/plant.ts";

const DB_PATH = "./data/db.json";

type DbShape = {
  plants: Plant[];
};

async function loadDb(): Promise<DbShape> {
  try {
    const text = await Deno.readTextFile(DB_PATH);
    return JSON.parse(text) as DbShape;
  } catch {
    return { plants: [] };
  }
}

async function saveDb(db: DbShape): Promise<void> {
  const text = JSON.stringify(db, null, 2);
  await Deno.writeTextFile(DB_PATH, text);
}

export const db = { loadDb, saveDb };





