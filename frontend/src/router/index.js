import { createRouter, createWebHistory } from "vue-router";
import Login from "../components/Login.vue";
import Recommendation from "../components/Recommendation.vue";

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

export default router;
