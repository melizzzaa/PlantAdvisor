import { createRouter, createWebHistory } from "vue-router";
import Login from "../components/Login.vue";
import Recommendation from "../components/Recommendation.vue";
import Favorites from "../views/Favorites.vue";

const routes = [
  { path: "/login", component: Login },
  { 
    path: "/recommendation",
    component: Recommendation,
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");

  if (to.meta.requiresAuth && !token) {
    next("/login");
  } else {
    next();
  }
});

const routes = [
  { path: "/", component: Home },
  { path: "/recommend", component: Recommendation },
  { path: "/favorites", component: Favorites },   // <--- NEU
  { path: "/login", component: Login },
];


export default router;
