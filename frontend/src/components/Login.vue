<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const username = ref("");
const password = ref("");
const message = ref("");

const router = useRouter();

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

    router.push("/recommendation");

  } catch (err) {
    message.value = "Fehler beim Login";
  }
}

function goToRegister() {
  router.push("/register");
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

    <div style="margin-top: 1rem;">
      <p>Noch keinen Account?</p>
      <button @click="goToRegister">Registrieren</button>
    </div>

    <p>{{ message }}</p>
  </div>
</template>

<style>
</style>
