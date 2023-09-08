import express from 'express';
import { login,createSession,signUp,create } from '../controllers/user.controller.js';
import { checkSession } from '../middlwere/auth.js';

const router=express.Router();

router.get('/sign-up',checkSession,signUp);
router.post('/sign-up',create);
router.get('/sign-in',checkSession,login);
router.post('/sign-in',createSession);

export default router;