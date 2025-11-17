import { db } from "./db.ts";

export interface User {
  id: string;
  username: string;
  password: string;
  favorites: string[];
}

function makeUserId() {
  return crypto.randomUUID?.() ?? `u-${Date.now()}`;
}
 
export async function listUsers(): Promise<User[]> {
  const store = await db.loadDb();
  return store.users as User[];
}
