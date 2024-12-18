import { createRouter, createWebHistory } from 'vue-router';
import LandingPage from './views/landingpage.vue';
import FacilityPage from './views/facility.vue';
import LoginPage from './views/login.vue';
import RegisterPage from './views/register.vue';
import RulesPage from './views/rules.vue';
import UserView from './views/user/user.vue';
import AdminDashboard from './views/admin/admin.dashboard.vue';
import axios from 'axios';

const routes = [
  {
    path: '/',
    name: 'landing',
    component: LandingPage,
  },
  {
    path: '/facility',
    name: 'facility',
    component: FacilityPage,
  },
  {
    path: '/login',
    name: 'login',
    component: LoginPage,
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterPage,
  },
  {
    path: '/rules',
    name: 'rules',
    component: RulesPage,
  },
  {
    path: '/user',
    name: 'user',
    component: UserView,
    meta: { requiresAuth: true },
  },
  {
    path: '/admin/dashboard',
    name: 'adminDashboard',
    component: AdminDashboard,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role'); 

    if (!token) {
      next('/login');
    } else {
      try {
        const response = await axios.get('http://localhost:5000/auth/user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          if (to.matched.some(record => record.meta.requiresAdmin)) {
            if (role === 'admin') {
              next();
            } else {
              next('/user');
            }
          } else {
            next();
          }
        }
      } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        next('/login');
      }
    }
  } else {
    next();
  }
});


export default router;
