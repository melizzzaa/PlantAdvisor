import { db } from "./db.ts";
import { Plant } from "../models/plant.ts";

function makeId() {
  return crypto.randomUUID?.() ?? `p-${Date.now()}`;
}

function validate(input: Partial<Plant>) {
  const required = [
    "name",
    "soilType",
    "sunlight",
    "climateZone",
    "waterAvailability",
    "temperatureRange",
    "soilPH",
    "plantType",
    "careLevel",
    "waterRequirement",
    "frostResistance",
    "space",
    "harvestSeason",
  ] as const;

  for (const key of required) {
    if (!input[key] || input[key] === "") {
      throw new Error(`Field '${key}' is required`);
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
