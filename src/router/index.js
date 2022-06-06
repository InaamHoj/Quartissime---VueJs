import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import DetailsComiteView from "../views/DetailsComiteView.vue";
import ConnexionComiteView from "../views/ConnexionComiteView.vue";
import ProfilComiteView from "../views/ProfilComiteView.vue";
import InscriptionView from "../views/InscriptionView.vue";
import AdminView from "../views/AdminView.vue";
import DashboardView from "../views/DashboardView.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },

  {
    path: "/detailscomite",
    name: "detailscomite",
    component: DetailsComiteView,
    props: true,
  },

  {
    path: "/login",
    name: "login",
    component: ConnexionComiteView,
  },
  {
    path: "/profilcomite",
    name: "profilcomite",
    component: ProfilComiteView,
    meta: { requiresAuths: true },
  },

  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  },
  {
    path: "/inscription",
    name: "inscription",
    component: InscriptionView,
    props: true,
  },
  {
    path: "/admin",
    name: "admin",
    component: AdminView,
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: DashboardView,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !localStorage.getItem("admin_token")) {
    next({ name: "admin" });
  } else if (to.meta.requiresAuths && !localStorage.getItem("token")) {
    next({ name: "login" });
  } else {
    next();
  }
});

export default router;
