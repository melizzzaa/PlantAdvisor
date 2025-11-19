<script setup>
import { computed } from "vue";
import { token, setToken } from "../token.js";

const user = computed(() => {
  if (!token.value) return null;

  try {
    const payload = token.value.split(".")[1]
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
});

function logout() {
  setToken(null);
  window.location.href = "/login";
}
</script>


<template>
  <nav class="nav-wrapper">
    <div class="nav-inner">
      <div class="left">
        <router-link to="/">Empfehlungen</router-link>
        <router-link to="/favorites">Favoriten</router-link>
        <router-link v-if="user?.isAdmin" to="/admin">Admin</router-link>
      </div>

      <div class="right">
        <button v-if="user" class="logout-btn" @click="logout">Logout</button>
        <router-link v-else to="/login">Login</router-link>
      </div>
    </div>
  </nav>
</template>

<style scoped>
* {
  font-family: Arial, sans-serif;
  box-sizing: border-box;
}

.nav-wrapper {
  background: #f8f8f8;
  border-bottom: 1px solid #ddd;
  padding: 0.75rem 0;
}

.nav-inner {
  max-width: 100px;
  margin: 0 auto;

  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 0 2rem;
}

.left a {
  margin-right: 1rem; 
  text-decoration: none;
  color: #333;
  font-weight: bold;
}

.left a:hover {
  color: #4caf50;
}

.logout-btn {
  background: #4caf50;
  border: none;
  padding: 0.5rem 1rem;
  color: white;
  border-radius: 6px;
  cursor: pointer;
}

.logout-btn:hover {
  background: #45a049;
}

</style>
