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

async function hashPassword(password: string): Promise<string> {
  const data = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

export async function validatePassword(
  inputPassword: string,
  storedHash: string
): Promise<boolean> {
  const inputHash = await hashPassword(inputPassword);
  return inputHash === storedHash;
}


export async function listUsers(): Promise<User[]> {
  const store = await db.loadDb();
  return store.users as User[];
}

export async function findUserByUsername(username: string): Promise<User | undefined> {
  const store = await db.loadDb();
  return store.users.find((u) => u.username === username);
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
    password: await hashPassword(password), 
    favorites: []
  };

  store.users.push(newUser);
  await db.saveDb(store);

  return newUser;
}