<script setup>
import Nav from "./components/Nav.vue";
</script>

<template>
  <Nav />

  <div class="layout">
    <router-view />
  </div>

  <footer class="footer">
    PlantAdvisor © 2025
  </footer>
</template>


<style>
* {
  font-family: Arial, sans-serif;
  box-sizing: border-box;
}

/* Seitenränder */
.layout {
  padding-left: 2rem;
  padding-right: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

/* Klassischer Footer */
.footer {
  text-align: center;
  padding: 1rem;
  margin-top: 3rem;
  color: #555;
  font-size: 0.9rem;
  border-top: 1px solid #ddd;
  background: #f8f8f8;
}
</style>
