import express from 'express';
import { home } from '../controller/home.controller';

const router=express.Router();

router.get('/',home);