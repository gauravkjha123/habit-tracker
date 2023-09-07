import authValidation from '../validations/authValidation'
import logger from '../utils/customLogger'
import User from '../models/user';
import * as jwt from 'jsonwebtoken';
import { UserNotFound,invalidCredentials } from '../errors/userNotFound.error';

export const login = async(req,res,next)=>{
    try {
        let validate=authValidation(req.body);
        if (validate.error) {
            let { details }=validate.error;
            const message = details.map(i => i.message).join(',');
            logger.error(message);
            return res.status(400).json({status:false,message});
        }
        let {email,password}=req.body;
        let user=await User.findOne({email});
        if (!user) {
            throw new UserNotFound();
        }
        let isCorrectPassword=await user.comparePassword(password);
        if (!isCorrectPassword) {
            throw new invalidCredentials()
        }
        
        res.redirect('/dashboard')
    } catch (error) {
        
    }
}