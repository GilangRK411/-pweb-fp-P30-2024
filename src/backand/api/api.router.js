import express from 'express';
import { login } from '../controllers/user/user.login.controllers.js'; 
import { register } from '../controllers/user/user.register.controllers.js'; 
import { getUserSession } from '../controllers/user/user.session.controllers.js';
import { createLaporanFasilitas }  from '../controllers/laporan/laporan.fasilitas.controllers.js';
import { createLaporanPenghuni }  from '../controllers/laporan/laporan.penghuni.controllers.js';
import { authenticate } from '../middleware/user.authenticate.js';

const router = express.Router();

// LOGIN REGISET
router.post('/login', login);
router.post('/register', register);

// SESSION
router.get('/session', getUserSession);

// LAPORAN FASILITAS
router.post('/fasilitas', authenticate, createLaporanFasilitas);

// LAPORAN PENGHUNI
router.post('/laporan', createLaporanPenghuni);

export default router;
