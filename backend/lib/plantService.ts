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
