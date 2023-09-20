import express from 'express';
import { updateHabit } from '../../controllers/api/habit.controller.js';
import { auth } from '../../middlwere/api/auth.js';

const router=express.Router();

router.put('/:id',auth,updateHabit);

export default router;