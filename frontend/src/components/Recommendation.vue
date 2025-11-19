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
    if (value) params.append(key, value);
  }

  const res = await fetch("http://localhost:8000/api/recommend?" + params.toString());
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
    message.value = "Fehler beim Speichern.";
  }
}

onMounted(() => getRecommendations());

const translations = {
  plantType: {
    vegetable: "Gemüse",
    fruit: "Obst",
    herb: "Kräuter",
    ornamental: "Zierpflanze",
    grain: "Getreide",
    "energy crop": "Energiepflanze"
  },
  soilType: {
    loamy: "Lehm",
    sandy: "Sand",
    clay: "Ton",
    "humus-rich": "Humusreich"
  },
  sunlight: {
    "full sun": "Vollsonne",
    "partial shade": "Halbschatten",
    shade: "Schatten"
  },
  climateZone: {
    tropical: "Tropisch",
    subtropical: "Subtropisch",
    temperate: "Gemäßigt"
  },
  waterRequirement: {
    low: "Niedrig",
    medium: "Mittel",
    high: "Hoch"
  },
  harvestSeason: {
    spring: "Frühling",
    summer: "Sommer",
    autumn: "Herbst",
    winter: "Winter",
    "all year": "Ganzjährig"
  }
};

function t(category, value) {
  return translations[category]?.[value] || value;
}
</script>

<template>
  <div class="page-container">
    <h1>Empfehlungen für dich</h1>

    <h2>Filter</h2>

    <div class="filters">
      <label>Pflanzentyp:
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

      <label>Boden:
        <select v-model="filters.soilType">
          <option value="">Alle</option>
          <option value="loamy">Lehm</option>
          <option value="sandy">Sand</option>
          <option value="clay">Ton</option>
          <option value="humus-rich">Humusreich</option>
        </select>
      </label>

      <label>Licht:
        <select v-model="filters.sunlight">
          <option value="">Alle</option>
          <option value="full sun">Vollsonne</option>
          <option value="partial shade">Halbschatten</option>
          <option value="shade">Schatten</option>
        </select>
      </label>

      <label>Klimazone:
        <select v-model="filters.climateZone">
          <option value="">Alle</option>
          <option value="tropical">Tropisch</option>
          <option value="subtropical">Subtropisch</option>
          <option value="temperate">Gemäßigt</option>
        </select>
      </label>

      <label>Wasserbedarf:
        <select v-model="filters.waterRequirement">
          <option value="">Alle</option>
          <option value="low">Niedrig</option>
          <option value="medium">Mittel</option>
          <option value="high">Hoch</option>
        </select>
      </label>

      <label>Erntezeit:
        <select v-model="filters.harvestSeason">
          <option value="">Alle</option>
          <option value="spring">Frühling</option>
          <option value="summer">Sommer</option>
          <option value="autumn">Herbst</option>
          <option value="winter">Winter</option>
          <option value="all year">Ganzjährig</option>
        </select>
      </label>

      <button @click="getRecommendations" class="primary-btn">
        Vorschläge anzeigen
      </button>
    </div>

    <h2>Vorgeschlagene Pflanzen</h2>

    <div class="card-container">
      <div class="plant-card" v-for="p in results" :key="p.id">
        <h3>{{ p.name }}</h3>

        <ul class="plant-details">
          <li><strong>Typ:</strong> {{ t("plantType", p.plantType) }}</li>
          <li><strong>Boden:</strong> {{ t("soilType", p.soilType) }}</li>
          <li><strong>Licht:</strong> {{ t("sunlight", p.sunlight) }}</li>
          <li><strong>Klimazone:</strong> {{ t("climateZone", p.climateZone) }}</li>
          <li><strong>Wasserbedarf:</strong> {{ t("waterRequirement", p.waterRequirement) }}</li>
          <li><strong>Erntezeit:</strong> {{ t("harvestSeason", p.harvestSeason) }}</li>
        </ul>

        <button @click="addToFavorites(p.id)">Zu Favoriten</button>
      </div>
    </div>

    <p v-if="results.length === 0">Keine passenden Pflanzen gefunden.</p>

    <p v-if="message" class="message">{{ message }}</p>

    <button @click="$router.push('/favorites')" class="secondary-btn">
      → Zu meinen Favoriten
    </button>
  </div>
</template>

<style>
* { font-family: Arial, sans-serif; }

.page-container {
  max-width: 1000px;
  margin: auto;
}

.card-container {
  display: flex;
  flex-wrap: wrap;
  gap: 3rem;
  margin-top: 1rem;
}

.plant-card {
  width: 300px;
  border: 1px solid #ddd;
  padding: 1rem;
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.plant-card h3 {
  font-size: 1.4rem;
  margin-top: 0;
  margin-bottom: 0.75rem;
  font-weight: bold;
  color: #222;
}

.plant-details {
  list-style: none;
  padding: 0;
  margin: 0 0 1rem 0;
}

.plant-details li {
  margin-bottom: 0.4rem;
  font-size: 0.95rem;
}

.plant-card button {
  width: 100%;
  padding: 0.7rem;
  border: none;
  background: #4caf50;
  color: white;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 0.6rem;
}

.plant-card button:hover {
  background: #45a049;
}


.filters {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}

label {
  display: flex;
  flex-direction: column;
  font-weight: bold;
}

select {
  padding: 0.5rem;
  border-radius: 6px;
  border: 1px solid #ccc;
}

.primary-btn {
  grid-column: span 3;
  padding: 0.75rem;
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}
.primary-btn:hover { background: #45a049; }

.secondary-btn {
  padding: 0.75rem;
  margin-top: 2rem;
  background: #e8e8e8;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.message {
  color: red;
  margin-top: 1rem;
}
</style>
