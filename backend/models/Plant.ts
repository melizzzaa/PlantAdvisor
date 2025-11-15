
export interface Plant {
  // Basisdaten
  id: string;
  name: string;

  // 🌍 Standort & Klima
  climateZone: "tropical" | "mediterranean" | "temperate" | "cool" | "warm";
  sunlight: "full sun" | "partial shade" | "shade";
  waterAvailability: "low" | "medium" | "high";
  temperatureRange: string; // Beispiel: "10-30°C"

  // 🌾 Bodenfaktoren
  soilType: "sandy" | "loamy" | "clay" | "humus-rich" | string;
  soilPH: "acidic" | "neutral" | "alkaline" | "slightly acidic" | string;

  // 🌱 Pflanzenmerkmale
  plantType: "vegetable" | "fruit" | "herb" | "ornamental" | "grain" | "energy crop" | string;
  careLevel: "low" | "medium" | "high";
  waterRequirement: "low" | "medium" | "high";
  frostResistance: "sensitive" | "medium" | "hardy";

  // 🚜 Nutzung & Anbau
  space: "balcony" | "garden" | "field" | "indoor";
  harvestSeason: "spring" | "summer" | "autumn" | "winter" | "all year";
}
