import express from 'express';
import { login } from '../controllers/user.login.controllers.js'; 
import { register } from '../controllers/user.register.controllers.js'; 
import { getUserSession } from '../controllers/user.session.controllers.js';

const router = express.Router();

// LOGIN REGISET
router.post('/login', login);
router.post('/register', register);

// SESSION
router.get('/session', getUserSession);

export default router;
