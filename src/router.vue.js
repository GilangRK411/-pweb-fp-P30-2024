import { createRouter, createWebHistory } from 'vue-router';
import LandingPage from './views/landingpage.vue';
import FacilityPage from './views/facility.vue';
import LoginPage from './views/login.vue';
import RegisterPage from './views/register.vue';
import RulesPage from './views/rules.vue';
import UserView from './views/user/user.vue';
import UserSewa from './views/user/user.sewa.vue';
import UserBayar from './views/user/user.bayar.vue';
import LaporanFasilitas from './views/user/laporan.fasilitas.vue';
import laporanPenghuni from './views/user/laporan.penghuni.vue';
import AdminDashboard from './views/admin/admin.dashboard.vue';
import AdminLaporanFasilitas from './views/admin/admin.laporan.fasilitas.vue';
import AdminLaporanPenghuni from './views/admin/admin.laporan.penghuni.vue';
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
    path: '/user/sewa',
    name: 'sewa',
    component: UserSewa,
    meta: { requiresAuth: true },
  },
  {
    path: '/user/bayar',
    name: 'bayar',
    component: UserBayar,
    meta: { requiresAuth: true },
  },
  {
    path: '/laporan/fasilitas',
    name: 'laporanfasilitas',
    component: LaporanFasilitas,
    meta: { requiresAuth: true },
  },
  {
    path: '/laporan/penghuni',
    name: 'laporanpenghuni',
    component: laporanPenghuni,
    meta: { requiresAuth: true },
  },
  {
    path: '/admin/dashboard',
    name: 'admindashboard',
    component: AdminDashboard,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/laporan/fasilitas',
    name: 'adminlaporanfasilitas',
    component: AdminLaporanFasilitas,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/laporan/penghuni',
    name: 'adminlaporanpenghuni',
    component: AdminLaporanPenghuni,
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
