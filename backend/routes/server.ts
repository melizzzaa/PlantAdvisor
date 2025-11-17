import { Application, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { listPlants, createPlant, deletePlant, updatePlant} from "../lib/plantService.ts";


const app = new Application();

app.use((ctx, next) => {
  ctx.response.headers.set("Access-Control-Allow-Origin", "*");
  ctx.response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  ctx.response.headers.set("Access-Control-Allow-Headers", "Content-Type");

  if (ctx.request.method === "OPTIONS") {
    ctx.response.status = 204;
    return;
  }

  return next();
});


const router = new Router();

router.get("/api/test", (ctx) => {
  ctx.response.body = {
    message: "Backend geht",
    time: new Date().toISOString(),
  };
});

router.get("/api/plants", async (ctx) => {
  const plants = await listPlants();
  ctx.response.body = plants;
});

router.post("/api/plants", async (ctx) => {
  try {
    const body = ctx.request.body({ type: "json" });
    const input = await body.value;

    if (typeof input !== "object" || input === null) {
      ctx.response.status = 400;
      ctx.response.body = { error: "Ungültiger Request-Body" };
      return;
    }

    const newPlant = await createPlant(input);

    ctx.response.status = 201;
    ctx.response.body = newPlant;
  } catch (err) {
    ctx.response.status = 400;

    if (err instanceof Error) {
      ctx.response.body = { error: err.message };
    } else {
      ctx.response.body = { error: "Unbekannter Fehler" };
    }
  }
});

router.delete("/api/plants/:id", async (ctx) => {
  const id = ctx.params.id!;

  const deleted = await deletePlant(id);

  if (!deleted) {
    ctx.response.status = 404;
    ctx.response.body = { error: "Plant not found" };
    return;
  }

  ctx.response.status = 204;
});

router.put("/api/plants/:id", async (ctx) => {
  const id = ctx.params.id!;

  const body = ctx.request.body({ type: "json" });
  const input = await body.value;

  if (typeof input !== "object" || input === null) {
    ctx.response.status = 400;
    ctx.response.body = { error: "Ungültiger Request-Body" };
    return;
  }

  if (Object.keys(input).length === 0) {
    ctx.response.status = 400;
    ctx.response.body = { error: "Keine Daten zum Aktualisieren vorhanden" };
    return;
  }

  const updated = await updatePlant(id, input);

  if (!updated) {
    ctx.response.status = 404;
    ctx.response.body = { error: "Plant nicht gefunden" };
    return;
  }

  ctx.response.status = 200;
  ctx.response.body = updated;
});


router.get("/api/recommend", async (ctx) => {
  const query = ctx.request.url.searchParams;

  const plantType = query.get("plantType");
  const soilType = query.get("soilType");
  const sunlight = query.get("sunlight");
  const space = query.get("space");
  const climateZone = query.get("climateZone");
  const waterRequirement = query.get("waterRequirement");
  const harvestSeason = query.get("harvestSeason");

  const plants = await listPlants();

  const result = plants.filter((p) => {
    return (
      (!plantType || p.plantType === plantType) &&
      (!soilType || p.soilType === soilType) &&
      (!sunlight || p.sunlight === sunlight) &&
      (!space || p.space === space) &&
      (!climateZone || p.climateZone === climateZone) &&
      (!waterRequirement || p.waterRequirement === waterRequirement) &&
      (!harvestSeason || p.harvestSeason === harvestSeason)
    );
  });

  ctx.response.body = result;
});


app.use(router.routes());
app.use(router.allowedMethods());

console.log("Backend läuft auf http://localhost:8000, test unter http://localhost:8000/api/test");
await app.listen({ port: 8000 });

