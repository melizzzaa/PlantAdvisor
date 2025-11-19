<script setup>
import { ref, onMounted } from "vue";

const plants = ref([]);
const message = ref("");

const newPlant = ref({
  name: "",
  plantType: "",
  soilType: "",
  sunlight: "",
  climateZone: "",
  waterRequirement: "",
  harvestSeason: ""
});

async function loadPlants() {
  const res = await fetch("http://localhost:8000/api/plants");
  plants.value = await res.json();
}

async function createPlant() {
  const token = localStorage.getItem("token");

  const payload = {};
  for (const key in newPlant.value) {
    if (newPlant.value[key] !== "") {
      payload[key] = newPlant.value[key];
    }
  }

  const res = await fetch("http://localhost:8000/api/plants", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    message.value = "Fehler beim Anlegen.";
    return;
  }

  message.value = "Pflanze angelegt!";
  await loadPlants();

  Object.keys(newPlant.value).forEach(key => newPlant.value[key] = "");
}

async function deletePlant(id) {
  const token = localStorage.getItem("token");

  await fetch(`http://localhost:8000/api/plants/${id}`, {
    method: "DELETE",
    headers: { "Authorization": "Bearer " + token }
  });

  await loadPlants();
}

onMounted(loadPlants);
</script>

<template>
  <div class="page-container">

    <h1>Admin Bereich</h1>
    <h2>Neue Pflanze anlegen</h2>

    <form @submit.prevent="createPlant" class="form">

      <label>Name:
        <input v-model="newPlant.name" />
      </label>

      <label>Typ:
        <select v-model="newPlant.plantType">
          <option value="">Bitte wählen</option>
          <option value="vegetable">Gemüse</option>
          <option value="fruit">Obst</option>
          <option value="herb">Kräuter</option>
          <option value="ornamental">Zierpflanze</option>
          <option value="grain">Getreide</option>
          <option value="energy crop">Energiepflanze</option>
        </select>
      </label>

      <label>Boden:
        <select v-model="newPlant.soilType">
          <option value="">Bitte wählen</option>
          <option value="loamy">Lehm</option>
          <option value="sandy">Sand</option>
          <option value="clay">Ton</option>
          <option value="humus-rich">Humusreich</option>
        </select>
      </label>

      <label>Licht:
        <select v-model="newPlant.sunlight">
          <option value="">Bitte wählen</option>
          <option value="full sun">Vollsonne</option>
          <option value="partial shade">Halbschatten</option>
          <option value="shade">Schatten</option>
        </select>
      </label>

      <label>Klimazone:
        <select v-model="newPlant.climateZone">
          <option value="">Bitte wählen</option>
          <option value="tropical">Tropisch</option>
          <option value="subtropical">Subtropisch</option>
          <option value="temperate">Gemäßigt</option>
        </select>
      </label>

      <label>Wasserbedarf:
        <select v-model="newPlant.waterRequirement">
          <option value="">Bitte wählen</option>
          <option value="low">Niedrig</option>
          <option value="medium">Mittel</option>
          <option value="high">Hoch</option>
        </select>
      </label>

      <label>Erntezeit:
        <select v-model="newPlant.harvestSeason">
          <option value="">Bitte wählen</option>
          <option value="spring">Frühling</option>
          <option value="summer">Sommer</option>
          <option value="autumn">Herbst</option>
          <option value="winter">Winter</option>
          <option value="all year">Ganzjährig</option>
        </select>
      </label>

      <button type="submit" class="primary-btn">Speichern</button>
    </form>

    <p class="message">{{ message }}</p>

    <h2>Alle Pflanzen</h2>

    <ul class="plant-list">
      <li v-for="p in plants" :key="p.id">
        <span>{{ p.name }} ({{ p.plantType }})</span>
        <button @click="deletePlant(p.id)" class="delete-btn">Löschen</button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
* { font-family: Arial, sans-serif; }

.page-container {
  max-width: 1000px;
  margin: auto;
}

.form {
  background: #fff;
  padding: 1.5rem;
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(2, 1fr);
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
}

label {
  display: flex;
  flex-direction: column;
  font-weight: bold;
}

input, select {
  padding: 0.5rem;
  border-radius: 6px;
  border: 1px solid #ccc;
}

.primary-btn {
  padding: 0.75rem;
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  grid-column: span 2;
}
.primary-btn:hover { background: #45a049; }

.plant-list {
  list-style: none;
  padding: 0;
}

.plant-list li {
  display: flex;
  justify-content: space-between;
  background: #f9f9f9;
  padding: 0.7rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  margin-bottom: 0.5rem;
}

.delete-btn {
  background: #c62828;
  color: white;
  border: none;
  padding: 0.4rem 0.7rem;
  border-radius: 6px;
  cursor: pointer;
}
.delete-btn:hover {
  background: #b71c1c;
}

.message {
  color: green;
  margin-top: 1rem;
}
</style>
