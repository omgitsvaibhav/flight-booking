import { Router } from 'express';
import { signup, login, logout } from '../controllers/auth';
import { authMiddleware } from '../middleware/auth';

const authRoutes = Router();

authRoutes.post('/signup', signup);
authRoutes.post('/login', login);
authRoutes.post('/logout', authMiddleware, logout);

export default authRoutes;