import { findUserByUsername, validatePassword } from "./userService.ts";

const SECRET_KEY = "geheim";

function toBase64(data: string): string {
  return btoa(data)
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

async function createToken(payload: object): Promise<string> {
  const header = {
    alg: "HS256",
    typ: "JWT"
  };

  const encHeader = toBase64(JSON.stringify(header));
  const encPayload = toBase64(JSON.stringify(payload));

  const text = `${encHeader}.${encPayload}`;

  const keyData = new TextEncoder().encode(SECRET_KEY);
  const algorithm = { name: "HMAC", hash: "SHA-256" };

  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyData,
    algorithm,
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign(
    "HMAC",
    cryptoKey,
    new TextEncoder().encode(text)
  );

  const signatureArray = Array.from(new Uint8Array(signature));
  const encSignature = toBase64(
    String.fromCharCode(...signatureArray)
  );

  return `${encHeader}.${encPayload}.${encSignature}`;
}

export async function login(username: string, password: string) {
  const user = await findUserByUsername(username);
  if (!user) {
    throw new Error("Benutzer nicht gefunden");
  }

  const valid = await validatePassword(password, user.password);
  if (!valid) {
    throw new Error("Falsches Passwort");
  }

  const token = await createToken({ userId: user.id });
  return { token };
}
