<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { setToken } from "../token.js";

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


    setToken(data.token);


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
  <div class="page-container">
    <h1>Login</h1>

    <div class="form-container">

      <label> Benutzername
        <input v-model="username" />
      </label>

      <label> Passwort
        <input type="password" v-model="password" />
      </label>

      <button @click="loginUser" class="primary-btn">Einloggen</button>

      <div class="sub">
        <p>Noch keinen Account?</p>
        <button @click="goToRegister" class="secondary-btn">Registrieren</button>
      </div>

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

.form-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: #fff;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}

label {
  font-weight: bold;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

input {
  padding: 0.6rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 1rem;
}

.primary-btn {
  padding: 0.75rem;
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
}
.primary-btn:hover { background: #45a049; }

.secondary-btn {
  padding: 0.5rem;
  background: #e8e8e8;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
.secondary-btn:hover { background: #dcdcdc; }

.sub {
  text-align: center;
  margin-top: 1rem;
}

.message {
  color: red;
  font-weight: bold;
  margin-top: 1rem;
}
</style>
