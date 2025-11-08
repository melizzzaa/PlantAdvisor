import { Application, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";

const app = new Application();
const router = new Router();

router.get("/api/test", (ctx) => {
  ctx.response.body = {
    message: "Backend geht",
    time: new Date().toISOString(),
  };
});

app.use(router.routes());
app.use(router.allowedMethods());

console.log("Backend läuft auf http://localhost:8000, test unter http://localhost:8000/api/test");
await app.listen({ port: 8000 });