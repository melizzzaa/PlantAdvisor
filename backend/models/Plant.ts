export interface Plant {
  id: string;
  name: string;

  plantType: "vegetable" | "fruit" | "herb" | "ornamental" | "grain" | "energy crop";
  soilType: "sandy" | "loamy" | "clay" | "humus-rich";
  sunlight: "full sun" | "partial shade" | "shade";

  climateZone?: "tropical" | "subtropical" | "temperate";
  waterRequirement?: "low" | "medium" | "high";
  harvestSeason?: "spring" | "summer" | "autumn" | "winter" | "all year";
}
