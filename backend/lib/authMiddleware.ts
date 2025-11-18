import { validateToken } from "./authService.ts";

export async function requireAuth(ctx: any, next: any) {
  const authHeader = ctx.request.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    ctx.response.status = 401;
    ctx.response.body = { error: "Kein Token vorhanden" };
    return;
  }

  const token = authHeader.substring("Bearer ".length);

  try {
    const payload = await validateToken(token);
    ctx.state.user = payload.userId;
    ctx.state.isAdmin = payload.isAdmin; 
    
    await next();
  } catch (err) {
    ctx.response.status = 401;
    ctx.response.body = { error: "Ungültiger Token" };
  }
}
