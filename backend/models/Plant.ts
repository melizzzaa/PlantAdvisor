
export interface Plant {
  id: string;
  name: string;

  climateZone: "tropical" | "mediterranean" | "temperate" | "cool" | "warm";
  sunlight: "full sun" | "partial shade" | "shade";
  waterAvailability: "low" | "medium" | "high";
  temperatureRange: string;

  soilType: "sandy" | "loamy" | "clay" | "humus-rich" | string;
  soilPH: "acidic" | "neutral" | "alkaline" | "slightly acidic" | string;

  plantType: "vegetable" | "fruit" | "herb" | "ornamental" | "grain" | "energy crop" | string;
  careLevel: "low" | "medium" | "high";
  waterRequirement: "low" | "medium" | "high";
  frostResistance: "sensitive" | "medium" | "hardy";

  space: "balcony" | "garden" | "field" | "indoor";
  harvestSeason: "spring" | "summer" | "autumn" | "winter" | "all year";
}
