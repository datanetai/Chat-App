import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import ChatView from '../views/ChatView.vue'
import firebase from '@/firebase'; // import firebase

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: ChatView,
    meta: { requiresAuth: true }

  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView,
    meta: { onlyGuest: true }

  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { onlyGuest: true }

  },
  // {
  //   path: '/about',
  //   name: 'about',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  // }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const onlyGuest = to.matched.some(record => record.meta.onlyGuest);

  firebase.auth.onAuthStateChanged(user => {
    if (requiresAuth && !user) {
      next('/login');
    } else if (onlyGuest && user) {
      next('/');
    } else {
      next();
    }
  });
});
export default router
