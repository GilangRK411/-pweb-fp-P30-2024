import express from 'express';
import { login } from '../controllers/user/user.login.controllers.js'; 
import { register } from '../controllers/user/user.register.controllers.js'; 
import { getUserSession } from '../controllers/user/user.session.controllers.js';
import { createLaporanFasilitas, getLaporanFasilitas }  from '../controllers/laporan/laporan.fasilitas.controllers.js';
import { createLaporanPenghuni, getAllLaporanPenghuni }  from '../controllers/laporan/laporan.penghuni.controllers.js';
import { authenticate } from '../middleware/user.authenticate.js';

const router = express.Router();

// LOGIN REGISET
router.post('/login', login);
router.post('/register', register);

// SESSION
router.get('/session', getUserSession);

// LAPORAN FASILITAS
router.post('/fasilitas', authenticate, createLaporanFasilitas);
router.get('/fasilitas', authenticate, getLaporanFasilitas);

// LAPORAN PENGHUNI
router.post('/laporan', authenticate, createLaporanPenghuni);
router.get('/laporan', authenticate, getAllLaporanPenghuni);

export default router;
