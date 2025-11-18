<script setup>
import { ref, onMounted } from "vue";

const plants = ref([]);
const message = ref("");

const newPlant = ref({
  name: "",
  plantType: "",
  soilType: "",
  sunlight: "",
  space: "",
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

  const res = await fetch("http://localhost:8000/api/plants", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    },
    body: JSON.stringify(newPlant.value)
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
      <input v-model="newPlant.plantType" placeholder="Typ" />
      <input v-model="newPlant.soilType" placeholder="Boden" />
      <input v-model="newPlant.sunlight" placeholder="Licht" />
      <input v-model="newPlant.space" placeholder="Platz" />
      <input v-model="newPlant.climateZone" placeholder="Klima" />
      <input v-model="newPlant.waterRequirement" placeholder="Wasserbedarf" />
      <input v-model="newPlant.harvestSeason" placeholder="Erntezeit" />
      
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
