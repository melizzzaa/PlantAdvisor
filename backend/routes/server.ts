import { Application, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { createUser } from "../lib/userService.ts";
import { listPlants, createPlant, deletePlant, updatePlant } from "../lib/plantService.ts";
import { login } from "../lib/authService.ts";
import { requireAuth } from "../lib/authMiddleware.ts";
import { 
  listFavoritePlantIds,
  addFavorite,
  removeFavorite
} from "../lib/favoriteService.ts";

const app = new Application();

app.use((ctx, next) => {
  ctx.response.headers.set("Access-Control-Allow-Origin", "*");
  ctx.response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  ctx.response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

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

router.post("/api/login", async (ctx) => {
  try {
    const body = ctx.request.body({ type: "json" });
    const { username, password } = await body.value;

    const result = await login(username, password);

    ctx.response.status = 200;
    ctx.response.body = result;

  } catch (err) {
    ctx.response.status = 401;
    ctx.response.body = { 
      error: err instanceof Error ? err.message : String(err)
    };
  }
});

router.post("/api/register", async (ctx) => {
  try {
    const body = ctx.request.body({ type: "json" });
    const { username, password } = await body.value;

    if (!username || !password) {
      ctx.response.status = 400;
      ctx.response.body = { error: "Benutzername und Passwort erforderlich" };
      return;
    }

    const newUser = await createUser(username, password);

    ctx.response.status = 201;
    ctx.response.body = { 
      message: "Nutzer erstellt",
      userId: newUser.id 
    };

  } catch (err) {
    ctx.response.status = 400;
    ctx.response.body = { 
      error: err instanceof Error ? err.message : String(err)
    };
  }
});


router.get("/api/plants", async (ctx) => {
  const plants = await listPlants();
  ctx.response.body = plants;
});

router.post("/api/plants", requireAuth, async (ctx) => {
  if (!ctx.state.isAdmin) {
    ctx.response.status = 403;
    ctx.response.body = { error: "Nur Admins dürfen Pflanzen anlegen." };
    return;
  }

  try {
    const body = ctx.request.body({ type: "json" });
    const input = await body.value;

    const newPlant = await createPlant(input);

    ctx.response.status = 201;
    ctx.response.body = newPlant;
  } catch (err) {
    ctx.response.status = 400;
    ctx.response.body = { 
      error: err instanceof Error ? err.message : String(err)
    };
  }
});

router.delete("/api/plants/:id", requireAuth, async (ctx) => {
  if (!ctx.state.isAdmin) {
    ctx.response.status = 403;
    ctx.response.body = { error: "Nur Admins dürfen Pflanzen löschen." };
    return;
  }

  const id = ctx.params.id!;
  const deleted = await deletePlant(id);

  if (!deleted) {
    ctx.response.status = 404;
    ctx.response.body = { error: "Plant not found" };
    return;
  }

  ctx.response.status = 204;
});

router.put("/api/plants/:id", requireAuth, async (ctx) => {
  if (!ctx.state.isAdmin) {
    ctx.response.status = 403;
    ctx.response.body = { error: "Nur Admins dürfen Pflanzen bearbeiten." };
    return;
  }

  const id = ctx.params.id!;
  const body = ctx.request.body({ type: "json" });
  const input = await body.value;

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
  const plants = await listPlants();

  const result = plants.filter((p) => {
    return (
      (!query.get("plantType") || p.plantType === query.get("plantType")) &&
      (!query.get("soilType") || p.soilType === query.get("soilType")) &&
      (!query.get("sunlight") || p.sunlight === query.get("sunlight")) &&
      (!query.get("climateZone") || p.climateZone === query.get("climateZone")) &&
      (!query.get("waterRequirement") || p.waterRequirement === query.get("waterRequirement")) &&
      (!query.get("harvestSeason") || p.harvestSeason === query.get("harvestSeason"))
    );
  });

  ctx.response.body = result;
});

router.get("/api/favorites", requireAuth, async (ctx) => {
  try {
    const userId = ctx.state.user;
    const plantIds = await listFavoritePlantIds(userId);
    const plants = await listPlants();

    ctx.response.body = plants.filter((p) => plantIds.includes(p.id));

  } catch (err) {
    ctx.response.status = 500;
    ctx.response.body = { error: "Fehler beim Laden der Favoriten" };
  }
});

router.post("/api/favorites", requireAuth, async (ctx) => {
  try {
    const userId = ctx.state.user;
    const body = ctx.request.body({ type: "json" });
    const input = await body.value;

    await addFavorite(userId, input.plantId);

    ctx.response.status = 201;
    ctx.response.body = { success: true };

  } catch (err) {
    ctx.response.status = 400;
    ctx.response.body = { 
      error: err instanceof Error ? err.message : String(err)
    };
  }
});

router.delete("/api/favorites/:plantId", requireAuth, async (ctx) => {
  try {
    const userId = ctx.state.user;
    const plantId = ctx.params.plantId;

    await removeFavorite(userId, plantId);

    ctx.response.status = 204;

  } catch (err) {
    ctx.response.status = 400;
    ctx.response.body = { error: "Fehler beim Entfernen des Favoriten" };
  }
});

app.use(router.routes());
app.use(router.allowedMethods());

console.log("Backend läuft auf http://localhost:8000/api/test");
await app.listen({ port: 8000 });
