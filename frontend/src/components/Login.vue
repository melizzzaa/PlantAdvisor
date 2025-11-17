<script setup>
import { ref } from "vue";

const username = ref("");
const password = ref("");
const message = ref("");

async function loginUser() {
  message.value = "";

  try {
    const res = await fetch("http://localhost:8000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: username.value,
        password: password.value
      })
    });

    const data = await res.json();

    if (!res.ok) {
      message.value = data.error || "Login fehlgeschlagen";
      return;
    }

    localStorage.setItem("token", data.token);

    message.value = "Login erfolgreich!";
  } catch (err) {
    message.value = "Fehler beim Login";
  }
}
</script>

<template>
  <h1>Login</h1>

  <div class="login-container">
    <label>
      Benutzername:
      <input v-model="username" />
    </label>

    <label>
      Passwort:
      <input type="password" v-model="password" />
    </label>

    <button @click="loginUser">Einloggen</button>

    <p>{{ message }}</p>
  </div>
</template>

<style>
</style>
