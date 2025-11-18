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
      headers: {
        "Authorization": "Bearer " + token
      }
    });

    if (!res.ok) {
      message.value = "Fehler beim Laden der Favoriten.";
      return;
    }

    favorites.value = await res.json();
  } catch {
    message.value = "Serverfehler beim Laden.";
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
    message.value = "Serverfehler beim Entfernen.";
  }
}

onMounted(() => {
  loadFavorites();
});
</script>

<template>
  <div>
    <h1>Meine Favoriten</h1>

    <p v-if="message">{{ message }}</p>

    <ul v-if="favorites.length > 0">
      <li v-for="p in favorites" :key="p.id">
        {{ p.name }} – {{ p.plantType }} – {{ p.soilType }}
        <button @click="removeFavorite(p.id)">Entfernen</button>
      </li>
    </ul>

    <p v-else-if="!message">Keine Favoriten vorhanden.</p>
  </div>
  <button @click="$router.push('/')" style="margin-bottom: 1rem;">
    ← Zurück zu Empfehlungen
  </button>

</template>

<style scoped>
button {
  margin-left: 10px;
}
</style>
