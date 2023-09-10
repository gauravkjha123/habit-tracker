import express from 'express';
import { findHabits,createHabit,updateHabit,deleteHabit,changeStatus } from '../../controllers/api/habit.controller.js';
import { auth } from '../../middlwere/api/auth.js';

const router=express.Router();

router.get('/',auth,findHabits);
router.post('/',auth,createHabit);
router.put('/:id',auth,updateHabit);
router.delete('/:id',auth,deleteHabit);
router.post('/status/:id',auth,changeStatus);

export default router;