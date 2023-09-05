import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      component: () => import("@/pages/homePage.vue")
    },
    {
      path: '/login',
      component: () => import("@/pages/loginPage.vue")
    },
    {
      path: '/user',
      component: () => import("@/pages/userPage.vue")
    },
    {
      path: '/admin',
      component: () => import("@/pages/adminPage.vue")
    },
    {
      path:'/store',
      component: () => import("@/pages/storePage.vue")
    },
    {
      path:'/good',
      component: () => import("@/pages/goodPage.vue")
    }
  ],
});

export default router;
