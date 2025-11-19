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

  console.log("newPlant vor dem Clean:", newPlant.value);

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
    headers: {
      "Authorization": "Bearer " + token
    }
  });

  await loadPlants();
}

onMounted(loadPlants);
</script>

<template>
  <div>
    <h1>Admin Bereich</h1>

    <h2>Neue Pflanze anlegen</h2>

    <form @submit.prevent="createPlant">
    <input v-model="newPlant.name" placeholder="Name" />

    <label>Typ:</label>
    <select v-model="newPlant.plantType">
        <option value="">Bitte wählen</option>
        <option value="vegetable">Gemüse</option>
        <option value="fruit">Obst</option>
        <option value="herb">Kräuter</option>
        <option value="ornamental">Zierpflanze</option>
        <option value="grain">Getreide</option>
        <option value="energy crop">Energiepflanze</option>
    </select>

    <label>Boden:</label>
    <select v-model="newPlant.soilType">
        <option value="">Bitte wählen</option>
        <option value="loamy">Lehm</option>
        <option value="sandy">Sand</option>
        <option value="clay">Ton</option>
        <option value="humus-rich">Humusreich</option>
    </select>

    <label>Licht:</label>
    <select v-model="newPlant.sunlight">
        <option value="">Bitte wählen</option>
        <option value="full sun">Vollsonne</option>
        <option value="partial shade">Halbschatten</option>
        <option value="shade">Schatten</option>
    </select>

    <label>Klimazone:</label>
    <select v-model="newPlant.climateZone">
        <option value="">Bitte wählen</option>
        <option value="tropical">Tropisch</option>
        <option value="subtropical">Subtropisch</option>
        <option value="temperate">Gemäßigt</option>
    </select>

    <label>Wasserbedarf:</label>
    <select v-model="newPlant.waterRequirement">
        <option value="">Bitte wählen</option>
        <option value="low">Niedrig</option>
        <option value="medium">Mittel</option>
        <option value="high">Hoch</option>
    </select>

    <label>Erntezeit:</label>
    <select v-model="newPlant.harvestSeason">
        <option value="">Bitte wählen</option>
        <option value="spring">Frühling</option>
        <option value="summer">Sommer</option>
        <option value="autumn">Herbst</option>
        <option value="winter">Winter</option>
        <option value="all year">Ganzjährig</option>
    </select>

    <button type="submit">Speichern</button>
    </form>

    <p>{{ message }}</p>

    <h2>Alle Pflanzen</h2>

    <ul>
      <li v-for="p in plants" :key="p.id">
        {{ p.name }} ({{ p.plantType }})
        <button @click="deletePlant(p.id)">Löschen</button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
input {
  display: block;
  margin: 5px 0;
}
button {
  margin-top: 10px;
}
</style>
