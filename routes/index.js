import express from 'express';
import userRoutes from './user.js'
import { home } from '../controllers/home.controller.js';

const router=express.Router();

router.get('/',home);
router.use('/user',userRoutes)

export default router;