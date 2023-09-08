import authValidation from "../validations/authValidation.js";
import userValidation from "../validations/userValidation.js";
import logger from "../utils/customLogger.js";
import User from "../models/user.js";
import * as jwt from "jsonwebtoken";
import {
  UserNotFound,
  invalidCredentials,
  UserAlreadyExist,
  PasswordNotMatch,
} from "../errors/userNotFound.error.js";

export const signUp = (req, res) => {
  return res.render("_singUp");
};

export const login = (req, res) => {
  return res.render("_login");
};

export const create = async (req, res) => {
  try {
    let validate = userValidation(req.body);
    if (validate.error) {
      let { details } = validate.error;
      const message = details.map((i) => i.message).join(",");
      logger.error(message);
      req.flash("error_msg", message);
      return res.redirect("back");
    }
    let { password, confirm_password, email } = req.body;
    if (confirm_password !== password) {
      throw PasswordNotMatch();
    }
    let isUserExist = await User.find({ email });
    if (isUserExist) {
      throw new UserAlreadyExist();
    }
    await User.insertMany(req.body);
    req.flash("success_msg", "Resistaration succefully");
    return res.redirect("/user/sign_in");
  } catch (error) {
    logger.error(error);
    req.flash("error_msg", error.message);
    return res.redirect("back");
  }
};

export const createSession = async (req, res) => {
  try {
    let validate = authValidation(req.body);
    if (validate.error) {
      let { details } = validate.error;
      const message = details.map((i) => i.message).join(",");
      logger.error(message);
      req.flash("error_msg", message);
      return res.redirect("back");
    }
    let { email, password } = req.body;
    let user = await User.findOne({ email });
    if (!user) {
      throw new UserNotFound();
    }
    let isCorrectPassword = await user.comparePassword(password);
    if (!isCorrectPassword) {
      throw new invalidCredentials();
    }
    const token = await jwt.sign(user.id, process.env.JWT_SECRET_KEY, {
      algorithm: process.env.JWT_ALGORITHM,
      expiresIn: process.env.JWT_EXPIRE_TIME,
    });
    req.session.token = token;
    req.flash("success_msg", "Login succseefully");
    return res.redirect("/dashboard");
  } catch (error) {
    logger.error(error);
    req.flash("error_msg", error.message);
    return res.redirect("back");
  }
};
