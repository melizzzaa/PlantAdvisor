<script setup>
import { ref, onMounted } from "vue";

const message = ref("");

const filters = ref({
  plantType: "",
  soilType: "",
  sunlight: "",
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

async function addToFavorites(plantId) {
  message.value = "";

  const token = localStorage.getItem("token");
  if (!token) {
    message.value = "Bitte zuerst einloggen, um Favoriten zu speichern.";
    return;
  }

  try {
    const res = await fetch("http://localhost:8000/api/favorites", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify({ plantId })
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      message.value = data.error || "Konnte Favorit nicht speichern.";
      return;
    }

    message.value = "Favorit gespeichert.";
  } catch (err) {
    message.value = "Fehler beim Speichern des Favoriten.";
  }
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
      Klimazone:
      <select v-model="filters.climateZone">
        <option value="">Alle</option>
        <option value="tropical">Tropisch</option>
        <option value="subtropical">Subtropisch</option>
        <option value="temperate">Gemäßigt</option>
      </select>
    </label>


    <label>
      Wasserbedarf:
      <select v-model="filters.waterRequirement">
        <option value="">Alle</option>
        <option value="low">Niedrig</option>
        <option value="medium">Mittel</option>
        <option value="high">Hoch</option>
      </select>
    </label>

    <label>
      Erntezeit:
      <select v-model="filters.harvestSeason">
        <option value="">Alle</option>
        <option value="spring">Frühling</option>
        <option value="summer">Sommer</option>
        <option value="autumn">Herbst</option>
        <option value="winter">Winter</option>
        <option value="all year">Ganzjährig</option>
      </select>
    </label>

    <button @click="getRecommendations">Vorschläge anzeigen</button>
  </div>

  <h2>Vorgeschlagene Pflanzen:</h2>

  <ul>
    <li v-for="p in results" :key="p.id">
      {{ p.name }} – {{ p.plantType }} – {{ p.soilType }}
      <button @click="addToFavorites(p.id)">Zu Favoriten</button>
    </li>
  </ul>

  <p v-if="message">{{ message }}</p>

  <p v-if="results.length === 0">Keine passenden Pflanzen gefunden.</p>

<button @click="$router.push('/favorites')" style="margin-bottom: 1rem;">
  → Zu meinen Favoriten
</button>

</template>

<style>
</style>
