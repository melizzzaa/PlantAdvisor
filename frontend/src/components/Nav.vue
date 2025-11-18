<script setup>
import { ref } from "vue";

const token = localStorage.getItem("token");

const user = ref(null);

if (token) {
  try {
    user.value = JSON.parse(
      atob(
        token.split(".")[1]
          .replace(/-/g, "+")
          .replace(/_/g, "/")
      )
    );
  } catch (e) {
    user.value = null;
  }
}
function logout() {
  localStorage.removeItem("token");
  window.location.href = "/login";
}
</script>

<template>
  <nav class="nav">

    <router-link to="/">Empfehlungen</router-link>
    <router-link to="/favorites">Favoriten</router-link>

    <router-link v-if="user?.isAdmin" to="/admin">Admin</router-link>

    <button v-if="user" @click="logout">Logout</button>

    <router-link v-else to="/login">Login</router-link>

  </nav>
</template>

<style scoped>
.nav {
  display: flex;
  gap: 1rem;
  padding: 1rem 0;
}
button {
  cursor: pointer;
}
</style>
