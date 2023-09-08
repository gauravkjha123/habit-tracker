import * as jwt from "jsonwebtoken";
import User from "../models/user.js";
import logger from "../utils/customLogger.js";

export const auth = async (req, res, next) => {
  try {
    const { session } = req;

    if (!session || !session.token) {
      return res.redirect("/");
    }

    const { token } = session;

    try {
      const userId = jwt.verify(token, process.env.JWT_SECRET_KEY, {
        algorithms: [process.env.JWT_ALGORITHM],
      });

      if (!userId) {
        return res.redirect("/");
      }
      const user = await User.findOne({ id: userId });

      if (!user) {
        return res.redirect("/");
      }

      res.locals.user = user;
      next();
    } catch (error) {
      session.destroy();
      res.redirect("/");
    }
  } catch (error) {
    logger.error(error);
    res.redirect("/");
  }
};

export const checkSession = async (req, res, next) => {
  try {
    const { session } = req;
    if (session || session.token) {
      const { token } = session;
      const userId = jwt.verify(token, process.env.JWT_SECRET_KEY, {
        algorithms: [process.env.JWT_ALGORITHM],
      });
      if (!userId) {
        return next();;
      }
      let user = await User.findOne({ id: userId });
      if (user) return res.redirect("/dashboard");
      next();
    }
    next();
  } catch (error) {
    next();
    logger.log(error);
  }
};
