import { db } from "./db.ts";
import { Plant } from "../models/plant.ts";

function makeId() {
  // stabile ID, wenn crypto verfügbar, sonst Fallback
  return crypto.randomUUID?.() ?? `p-${Date.now()}`;
}

function validate(input: Partial<Plant>) {
  if (!input.name || typeof input.name !== "string") {
    throw new Error("name is required");
  }
  if (!input.soilType || typeof input.soilType !== "string") {
    throw new Error("soilType is required");
  }
  if (!input.sunlight || typeof input.sunlight !== "string") {
    throw new Error("sunlight is required");
  }
}

export async function listPlants(): Promise<Plant[]> {
  const store = await db.loadDb();
  // TypeScript fix: unknown → Plant[]
  return store.plants as unknown as Plant[];
}

export async function createPlant(input: Partial<Plant>): Promise<Plant> {
  validate(input);
  const store = await db.loadDb();

  // ✅ Name angepasst: 'newPlant' statt 'plantType'
  const newPlant: Plant = {
    id: makeId(),
    name: input.name!,
    soilType: input.soilType!,
    sunlight: input.sunlight!,
    // optional: leere Felder, damit kein Typfehler kommt
    plantType: input.plantType ?? "",
    careLevel: input.careLevel ?? "medium",
    waterRequirement: input.waterRequirement ?? "medium",
    frostResistance: input.frostResistance ?? "medium",
    climateZone: input.climateZone ?? "temperate",
    waterAvailability: input.waterAvailability ?? "medium",
    temperatureRange: input.temperatureRange ?? "",
    soilPH: input.soilPH ?? "neutral",
    space: input.space ?? "garden",
    harvestSeason: input.harvestSeason ?? "summer",
  };

  store.plants.push(newPlant);
  await db.saveDb(store);
  return newPlant;
}
