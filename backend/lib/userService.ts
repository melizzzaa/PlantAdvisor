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

export async function createUser(username: string, password: string): Promise<User> {
  const store = await db.loadDb();

  const exists = store.users.find((u) => u.username === username);
  if (exists) {
    throw new Error("Benutzer existiert bereits");
  }

  const newUser: User = {
    id: makeUserId(),
    username,
    password,  
    favorites: []
  };

  store.users.push(newUser);
  await db.saveDb(store);

  return newUser;
}
