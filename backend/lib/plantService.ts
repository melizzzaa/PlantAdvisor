import { db } from "./db.ts";
import { Plant } from "../models/plant.ts";

function makeId() {
  return crypto.randomUUID?.() ?? `p-${Date.now()}`;
}

function validate(input: Partial<Plant>) {
  const requiredFields = [
    "name",
    "plantType",
    "soilType",
    "sunlight",
    "space",
  ] as const;

  for (const field of requiredFields) {
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
  soilType: input.soilType!,
  sunlight: input.sunlight!,
  climateZone: input.climateZone ?? "temperate",
  waterAvailability: input.waterAvailability ?? "medium",
  temperatureRange: input.temperatureRange ?? "10-25°C",
  soilPH: input.soilPH ?? "neutral",
  plantType: input.plantType ?? "herb",
  careLevel: input.careLevel ?? "medium",
  waterRequirement: input.waterRequirement ?? "medium",
  frostResistance: input.frostResistance ?? "medium",
  space: input.space ?? "garden",
  harvestSeason: input.harvestSeason ?? "summer",
};

  store.plants.push(newPlant);
  await db.saveDb(store);
  return newPlant;
}
