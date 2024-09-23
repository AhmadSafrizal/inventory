import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "@/views/DashboardPage.vue";
import Login from "@/views/LoginPage.vue";
import InTransactions from "@/views/IncomingTransactionPage.vue";
import OutTransactions from "@/views/OutgoingTransactionPage.vue";
import Products from "@/views/ProductPage.vue";
import Categories from "@/views/CategoryPage.vue";
import Users from "@/views/UserPage.vue";
import Cookies from "js-cookie";

const routes = [
  {
    path: "/",
    name: "Login",
    component: Login,
    meta: { layout: "none" },
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
    meta: { layout: "default" },
  },
  {
    path: "/products",
    name: "Products",
    component: Products,
    meta: { layout: "default" },
  },
  {
    path: "/categories",
    name: "Categories",
    component: Categories,
    meta: { layout: "default" },
  },
  {
    path: "/in-transactions",
    name: "In-Transactions",
    component: InTransactions,
    meta: { layout: "default" },
  },
  {
    path: "/out-transactions",
    name: "Out-Transactions",
    component: OutTransactions,
    meta: { layout: "default" },
  },
  {
    path: "/users",
    name: "Users",
    component: Users,
    meta: { layout: "default" },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

function getTokenFromCookie() {
  return Cookies.get("token");
}

router.beforeEach((to, from, next) => {
  const token = getTokenFromCookie();
  const isLoginPage = to.name === "Login";

  if (!token && !isLoginPage) {
    next({ name: "Login" });
  } else if (token && isLoginPage) {
    next({ name: "Dashboard" });
  } else {
    next();
  }
});

export default router;
