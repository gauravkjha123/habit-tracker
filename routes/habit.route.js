import express from 'express';
import { findHabitById,findHabits,createHabit,changeStatus,updateHabitfav,deleteHabit } from '../controllers/habit.controller.js';

import { auth } from '../middlwere/auth.js';

const router=express.Router();

router.get('/',auth,findHabits);
router.post('/',auth,createHabit);
router.get('/:id',auth,findHabitById);
router.get('/:id/delete',auth,deleteHabit);
router.get('/:id/fav',auth,updateHabitfav)
router.get('/:id/status',auth,changeStatus);

export default router;