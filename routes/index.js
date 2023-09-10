import express from 'express';
import userRoutes from './user.route.js'
import habitRoutes from './habit.route.js'
import apiRoutes from './api/index.js'
import { home } from '../controllers/home.controller.js';

const router=express.Router();

router.get('/',home);
router.use('/user',userRoutes)
router.use('/habit',habitRoutes)
router.use('/api',apiRoutes)

export default router;