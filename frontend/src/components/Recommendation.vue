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
  <h1>Empfehlungen für dich:</h1>

  <h2>Filter</h2>

  <div class="filters">
    <label>
      Pflanzentyp:
      <select v-model="filters.plantType">
        <option value="">Alle</option>
        <option value="vegetable">Gemüse</option>
        <option value="fruit">Obst</option>
        <option value="herb">Kräuter</option>
        <option value="ornamental">Zierpflanze</option>
        <option value="grain">Getreide</option>
        <option value="energy crop">Energiepflanze</option>
      </select>
    </label>

    <label>
      Boden:
      <select v-model="filters.soilType">
        <option value="">Alle</option>
        <option value="loamy">Lehm</option>
        <option value="sandy">Sand</option>
        <option value="clay">Ton</option>
        <option value="humus-rich">Humusreich</option>
      </select>
    </label>

    <label>
      Licht:
      <select v-model="filters.sunlight">
        <option value="">Alle</option>
        <option value="full sun">Vollsonne</option>
        <option value="partial shade">Halbschatten</option>
        <option value="shade">Schatten</option>
      </select>
    </label>

    <label>
      Standort:
      <select v-model="filters.space">
        <option value="">Alle</option>
        <option value="garden">Garten</option>
        <option value="balcony">Balkon</option>
        <option value="field">Feld</option>
        <option value="indoor">Innenraum</option>
      </select>
    </label>

    <button @click="getRecommendations">Vorschläge anzeigen</button>
  </div>
  <h2>Vorgeschlagene Pflanzen:</h2>

<ul>
  <li v-for="p in results" :key="p.id">
    {{ p.name }} – {{ p.plantType }} – {{ p.soilType }}
  </li>
</ul>

</template>

<style>
</style>