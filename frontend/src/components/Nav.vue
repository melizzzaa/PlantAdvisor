<template>
  <nav class="nav">
    <router-link to="/">Home</router-link>
    <router-link to="/recommend">Empfehlungen</router-link>
    <router-link to="/favorites">Favoriten</router-link>
    <router-link to="/login">Login</router-link>
  </nav>
</template>

<script setup>
</script>

<style scoped>
.nav {
  display: flex;
  gap: 1rem;
  padding: 1rem 0;
}
</style>
