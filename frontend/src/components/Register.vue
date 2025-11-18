<script setup>
import { ref } from "vue";

const username = ref("");
const password = ref("");
const message = ref("");

async function registerUser() {
  message.value = "";

  const res = await fetch("http://localhost:8000/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: username.value,
      password: password.value
    })
  });

  const data = await res.json();

  if (!res.ok) {
    message.value = data.error || "Registrierung fehlgeschlagen";
    return;
  }

  message.value = "Registrierung erfolgreich! Bitte einloggen.";
}
</script>

<template>
  <h1>Registrieren</h1>

  <input v-model="username" placeholder="Benutzername">
  <input v-model="password" placeholder="Passwort" type="password">

  <button @click="registerUser">Konto erstellen</button>

  <p>{{ message }}</p>
</template>
