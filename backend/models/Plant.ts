export interface Plant {
  id: string;
  name: string;

  plantType: "vegetable" | "fruit" | "herb" | "ornamental" | "grain" | "energy crop";
  soilType: "sandy" | "loamy" | "clay" | "humus-rich";
  sunlight: "full sun" | "partial shade" | "shade";
  space: "balcony" | "garden" | "field" | "indoor";

  climateZone?: "tropical" | "mediterranean" | "temperate" | "cool" | "warm";
  waterRequirement?: "low" | "medium" | "high";
  harvestSeason?: "spring" | "summer" | "autumn" | "winter" | "all year";
}
