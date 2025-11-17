import { findUserByUsername, validatePassword } from "./userService.ts";

export async function login(username: string, password: string) {
    
  const user = await findUserByUsername(username);
  if (!user) {
    throw new Error("Benutzer nicht gefunden");
  }

  const isValid = await validatePassword(password, user.password);
  if (!isValid) {
    throw new Error("Falsches Passwort");
  }

  return user;
}
