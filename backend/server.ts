import { Application, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { listPlants, createPlant, deletePlant, updatePlant} from "./lib/plantService.ts";

const app = new Application();
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

    const newPlant = await createPlant(input);

    ctx.response.status = 201;
    ctx.response.body = newPlant;
  } catch (err) {
    ctx.response.status = 400;

    if (err instanceof Error) {
      ctx.response.body = { error: err.message };
    } else {
      ctx.response.body = { error: "Error occurred" };
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

  const updated = await updatePlant(id, input);

  if (!updated) {
    ctx.response.status = 404;
    ctx.response.body = { error: "Plant not found" };
    return;
  }
  ctx.response.status = 200;
  ctx.response.body = updated;
});


app.use(router.routes());
app.use(router.allowedMethods());

console.log("Richtige Datei läuft");
console.log("Backend läuft auf http://localhost:8000, test unter http://localhost:8000/api/test");
await app.listen({ port: 8000 });

