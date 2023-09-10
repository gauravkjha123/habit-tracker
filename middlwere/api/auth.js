import jwt from "jsonwebtoken";
import User from "../../models/user.js";
import logger from "../../lib/logger/logger.js";
import  { env } from '../../env.js'

export const auth = async (req, res, next) => {
  try {
    const authorization = req.header('Authorization');

    if (!authorization ) {
      logger.info('Credentials provided by the client', authorization);
      return res.status(403).json({error:'Un-authorised!'});
    }
    const user =await decode(authorization.split(' ')[1]);
    logger.info('Credentials provided by the client', user, authorization);

    if (!user) {
      logger.info('Credentials provided by the client', authorization);
      return res.status(403).json({error:'Un-authorised!'})
    }
    req.user = user;
    next();
  } catch (error) {
    logger.info('Expired credentials provided by the client', error.message);
    res.status(403).json({error:'Un-authorised!'})
  }
};

const decode=async (token)=>{
    try {
        const decoded = jwt.verify(token, env.jwt.secret );
        const user = await User.findById(decoded.id);
        if (user) {
            return user;
        }
        return undefined;
    } catch (error) {
        return undefined;
    }
}