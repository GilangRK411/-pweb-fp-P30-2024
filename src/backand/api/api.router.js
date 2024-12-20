import express from 'express';
import { login } from '../controllers/user/user.login.controllers.js'; 
import { register } from '../controllers/user/user.register.controllers.js'; 
import { getUserSession } from '../controllers/user/user.session.controllers.js';
import { createLaporan, getLaporan }  from '../controllers/laporan/laporan.fasilitas.controllers.js';
import { authenticate } from '../middleware/user.authenticate.js';

const router = express.Router();

// LOGIN REGISET
router.post('/login', login);
router.post('/register', register);

// SESSION
router.get('/session', getUserSession);

// LAPORAN FASILITAS
router.post('/fasilitas', authenticate, createLaporan);

router.get('/fasilitas',  getLaporan);

export default router;
