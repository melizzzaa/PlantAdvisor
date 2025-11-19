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

export async function updatePlant(id: string, input: Partial<Plant>): Promise<Plant | null> {
  const store = await db.loadDb();
  const plant = store.plants.find((p) => p.id === id);

  if (!plant) {
    return null;
  }

  if (input.name !== undefined) {
    plant.name = input.name;
  }

  if (input.plantType !== undefined) {
    plant.plantType = input.plantType;
  }

  if (input.soilType !== undefined) {
    plant.soilType = input.soilType;
  }

  if (input.sunlight !== undefined) {
    plant.sunlight = input.sunlight;
  }

  if (input.climateZone !== undefined) {
    plant.climateZone = input.climateZone;
  }

  if (input.waterRequirement !== undefined) {
    plant.waterRequirement = input.waterRequirement;
  }

  if (input.harvestSeason !== undefined) {
    plant.harvestSeason = input.harvestSeason;
  }

  await db.saveDb(store);
  return plant;
}