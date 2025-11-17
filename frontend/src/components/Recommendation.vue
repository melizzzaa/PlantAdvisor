<script setup>
import { ref, onMounted } from "vue";

const filters = ref({
  plantType: "",
  soilType: "",
  sunlight: "",
  space: "",
  climateZone: "",
  waterRequirement: "",
  harvestSeason: ""
});

const results = ref([]);

async function getRecommendations() {
  const params = new URLSearchParams();

  for (const key in filters.value) {
    const value = filters.value[key];
    if (value) {
      params.append(key, value);
    }
  }

  const res = await fetch(
    "http://localhost:8000/api/recommend?" + params.toString()
  );
  results.value = await res.json();
}

onMounted(() => {
  getRecommendations();
});
</script>

<template>
</template>

<style>
</style>