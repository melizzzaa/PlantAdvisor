import { createRouter, createWebHistory } from "vue-router";

import Login from "../components/Login.vue";
import Recommendation from "../components/Recommendation.vue";
import Favorites from "../views/Favorites.vue";
import Admin from "../views/Admin.vue";
import Register from "../components/Register.vue";


const routes = [
  { 
    path: "/", 
    component: Recommendation,
    meta: { requiresAuth: true }
  },

  { 
    path: "/recommendation",
    component: Recommendation,
    meta: { requiresAuth: true }
  },

  {
    path: "/favorites",
    component: Favorites,
    meta: { requiresAuth: true }
  },

  { 
    path: "/admin",
    component: Admin,
    meta: { requiresAuth: true }
  },

  { 
    path: "/login", 
    component: Login 
  },

  { 
    path: "/register",
    component: Register
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

export default router;
