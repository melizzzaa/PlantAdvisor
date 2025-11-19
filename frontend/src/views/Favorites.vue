<script setup>
import { ref, onMounted } from "vue";

const favorites = ref([]);
const message = ref("");

async function loadFavorites() {
  message.value = "";
  const token = localStorage.getItem("token");

  if (!token) {
    message.value = "Bitte zuerst einloggen.";
    return;
  }

  try {
    const res = await fetch("http://localhost:8000/api/favorites", {
      headers: { "Authorization": "Bearer " + token }
    });

    if (!res.ok) {
      message.value = "Fehler beim Laden.";
      return;
    }

    favorites.value = await res.json();
  } catch {
    message.value = "Serverfehler.";
  }
}

async function removeFavorite(plantId) {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    const res = await fetch(`http://localhost:8000/api/favorites/${plantId}`, {
      method: "DELETE",
      headers: { "Authorization": "Bearer " + token }
    });

    if (res.ok) {
      favorites.value = favorites.value.filter(f => f.id !== plantId);
    } else {
      message.value = "Fehler beim Entfernen.";
    }
  } catch {
    message.value = "Serverfehler.";
  }
}

onMounted(loadFavorites);
</script>

<template>
  <div class="page-container">
    <h1>Meine Favoriten</h1>

    <p class="message">{{ message }}</p>

    <ul v-if="favorites.length > 0" class="fav-list">
      <li v-for="p in favorites" :key="p.id">
        {{ p.name }} – {{ p.plantType }} – {{ p.soilType }}
        <button class="delete-btn" @click="removeFavorite(p.id)">Entfernen</button>
      </li>
    </ul>

    <p v-else-if="!message">Keine Favoriten vorhanden.</p>

    <button @click="$router.push('/')" class="secondary-btn">
      ← Zurück zu Empfehlungen
    </button>
  </div>
</template>

<style scoped>
* { font-family: Arial, sans-serif; }

.page-container {
  max-width: 1000px;
  margin: auto;
}

.fav-list {
  list-style: none;
  padding: 0;
  margin-top: 1rem;
}

.fav-list li {
  display: flex;
  justify-content: space-between;
  padding: 0.7rem;
  background: #f9f9f9;
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
.delete-btn:hover { background: #b71c1c; }

.secondary-btn {
  margin-top: 1.5rem;
  padding: 0.7rem 1rem;
  background: #e8e8e8;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.message {
  margin-top: 1rem;
  color: red;
}
</style>
