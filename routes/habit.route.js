import express from 'express';
import { findHabitById } from '../controllers/habit.controller.js';

import { auth } from '../middlwere/auth.js';

const router=express.Router();

router.get('/:id',auth,findHabitById);

export default router;