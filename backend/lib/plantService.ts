import { db } from "./db.ts";
import { Plant } from "../models/plant.ts";

function makeId() {
  return crypto.randomUUID?.() ?? `p-${Date.now()}`;
}

function validate(input: Partial<Plant>) {
  const required = [
    "name",
    "plantType",
    "soilType",
    "sunlight",
    "space",
  ] as const;

  for (const field of required) {
    if (!input[field] || input[field] === "") {
      throw new Error(`Missing required field: '${field}'`);
    }
  }
}

export async function listPlants(): Promise<Plant[]> {
  const store = await db.loadDb();
  return store.plants as unknown as Plant[];
}

export async function createPlant(input: Partial<Plant>): Promise<Plant> {
  validate(input);
  const store = await db.loadDb();

  const newPlant: Plant = {
    id: makeId(),
    name: input.name!,
    plantType: input.plantType!,
    soilType: input.soilType!,
    sunlight: input.sunlight!,
    space: input.space!,
    climateZone: input.climateZone ?? "temperate",
    waterRequirement: input.waterRequirement ?? "medium",
    harvestSeason: input.harvestSeason ?? "summer",
  };

  store.plants.push(newPlant);
  await db.saveDb(store);

  return newPlant;
}

export async function deletePlant(id: string): Promise<boolean> {
  const store = await db.loadDb();
  const index = store.plants.findIndex((p) => p.id === id);

  if (index === -1) {
    return false;
  }

  store.plants.splice(index, 1);
  await db.saveDb(store);
  return true;
}

