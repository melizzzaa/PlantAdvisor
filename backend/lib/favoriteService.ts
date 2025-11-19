import { db } from "./db.ts";

type FavoriteEntry = {
  userId: string;
  plantId: string;
};

const FAVORITES_PATH = "../data/favorites.json";

async function loadFavorites(): Promise<FavoriteEntry[]> {
  try {
    const text = await Deno.readTextFile(FAVORITES_PATH);
    return JSON.parse(text) as FavoriteEntry[];
  } catch {
    return [];
  }
}

async function saveFavorites(favorites: FavoriteEntry[]): Promise<void> {
  const text = JSON.stringify(favorites, null, 2);
  await Deno.writeTextFile(FAVORITES_PATH, text);
}

export async function listFavoritePlantIds(userId: string): Promise<string[]> {
  const favorites = await loadFavorites();
  return favorites
    .filter((f) => f.userId === userId)
    .map((f) => f.plantId);
}

export async function addFavorite(userId: string, plantId: string): Promise<void> {
  const store = await db.loadDb();

  const plantExists = store.plants.some((p) => p.id === plantId);
  if (!plantExists) {
    throw new Error("Pflanze nicht gefunden");
  }

  const userExists = store.users.some((u) => u.id === userId);
  if (!userExists) {
    throw new Error("Benutzer nicht gefunden");
  }

  const favorites = await loadFavorites();

  const alreadyThere = favorites.find(
    (f) => f.userId === userId && f.plantId === plantId
  );

  if (alreadyThere) {
    return;
  }

  favorites.push({ userId, plantId });
  await saveFavorites(favorites);
}

export async function removeFavorite(userId: string, plantId: string): Promise<void> {
  const favorites = await loadFavorites();

  const filtered = favorites.filter(
    (f) => !(f.userId === userId && f.plantId === plantId)
  );

  await saveFavorites(filtered);
}
