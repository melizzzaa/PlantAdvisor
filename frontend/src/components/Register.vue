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
    try { data = await res.json(); } catch {}

    if (!res.ok) {
      message.value = data.error || "Registrierung fehlgeschlagen.";
      return;
    }

    window.location.href = "/login";

  } catch (err) {
    message.value = "Fehler bei der Registrierung.";
  }
}
</script>

<template>
  <div class="page-container">
    <h1>Registrieren</h1>

    <div class="form">
      <label>Benutzername:
        <input v-model="username" />
      </label>

      <label>Passwort:
        <input v-model="password" type="password" />
      </label>

      <button class="primary-btn" @click="registerUser">Konto erstellen</button>

      <p class="message">{{ message }}</p>
    </div>
  </div>
</template>

<style scoped>
* {
  font-family: Arial, sans-serif;
}

.page-container {
  max-width: 420px;
  margin: 2rem auto;
  padding: 2rem;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: #fff;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}

label {
  display: flex;
  flex-direction: column;
  font-weight: bold;
}

input {
  padding: 0.6rem;
  border: 1px solid #ccc;
  border-radius: 6px;
}

.primary-btn {
  padding: 0.75rem;
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}
.primary-btn:hover { background: #45a049; }

.message {
  color: red;
  margin-top: .5rem;
}
</style>
