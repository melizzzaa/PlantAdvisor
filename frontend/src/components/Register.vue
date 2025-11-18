<script setup>
import { ref } from "vue";

const username = ref("");
const password = ref("");
const message = ref("");

async function registerUser() {
  message.value = "";

  try {
    const res = await fetch("http://localhost:8000/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: username.value,
        password: password.value
      })
    });

    let data = {};
    try {
      data = await res.json();
    } catch (_) {}

    if (!res.ok) {
      message.value = data.error || "Registrierung fehlgeschlagen.";
      return;
    }

    message.value = "Registrierung erfolgreich! Bitte einloggen.";

  } catch (err) {
    message.value = "Verbindungsfehler.";
  }
}
</script>

<template>
  <h1>Registrieren</h1>

  <label> Benutzername:
    <input v-model="username">
  </label>

  <label> Passwort:
    <input v-model="password" type="password">
  </label>

  <button @click="registerUser">Konto erstellen</button>

  <p>{{ message }}</p>
</template>
