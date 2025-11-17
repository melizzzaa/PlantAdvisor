import { createRouter, createWebHistory } from "vue-router";
import Login from "../components/Login.vue";
import Recommendation from "../components/Recommendation.vue";

const routes = [
  { path: "/login", component: Login },
  { path: "/recommendation", component: Recommendation }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
