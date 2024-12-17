import { createRouter, createWebHistory } from 'vue-router';
import LandingPage from './views/landingpage.vue';
import FacilityPage from './views/facility.vue';
import LoginPage from './views/login.vue';
import RegisterPage from './views/register.vue';
import RulesPage from './views/rules.vue';
import UserView from './views/user.vue';
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
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    const token = localStorage.getItem('token');

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
          next(); 
        }
      } catch (error) {
        localStorage.removeItem('token')
        next('/login'); 
      }
    }
  } else {
    next();
  }
});

export default router;
