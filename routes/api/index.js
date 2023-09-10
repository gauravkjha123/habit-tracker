import express from 'express';
import userApiRoutes from './user.route.js'
import habitApiRoutes from './habit.route.js'

const router=express.Router();

router.use('/user',userApiRoutes)
router.use('/habit',habitApiRoutes)

export default router;