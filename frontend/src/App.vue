<script setup>
import { ref, onMounted } from "vue";

const plants = ref([]);

onMounted(async () => {
  const res = await fetch("http://localhost:8000/api/plants");
  plants.value = await res.json();
});
</script>

<template>
  <h1>Pflanzenliste</h1>

  <ul>
    <li v-for="p in plants" :key="p.id">
      {{ p.name }} ({{ p.plantType }})
    </li>
  </ul>
</template>

<style>
</style>
