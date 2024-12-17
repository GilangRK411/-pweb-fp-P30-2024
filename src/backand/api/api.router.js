import express from 'express';
import { login } from '../controllers/user.login.controllers.js'; 
import { register } from '../controllers/user.register.controllers.js'; 

const router = express.Router();

router.post('/login', login);
router.post('/register', register);

export default router;