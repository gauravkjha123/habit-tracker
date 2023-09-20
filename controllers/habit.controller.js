import createHabitValidation from "../validations/habitValidations/createHabit.validation.js";
import updateHabitValidation from "../validations/habitValidations/updateHabit.validation.js";
import updateHabitStatusValidation from "../validations/habitValidations/updateHabitStatus.validation.js";
import logger from "../lib/logger/logger.js";
import Habit from "../models/habit.js";
import { HabitAlreadyExistError, HabitNotFoundError } from "../errors/habit.error.js";
import { ActionForbiddenError } from "../errors/actionForbidden.error.js";
import { status } from "../enum/status.enum.js";


export const findHabits = async (req, res, next) => {
  try {
    const { user } = res?.locals;
    const habits = await Habit.find({ user: user._id });
    return res.render("_dashboard", { habits });
  } catch (error) {
    logger.error(error);
    req.flash("error_msg", error.message);
    return res.redirect("back");
  }
};

export const createHabit = async (req, res, next) => {
  try {
    const { user } = res?.locals;
    const habitData = req.body; // Assuming you receive habit data in the request body

    // Validate the habit data using createHabitValidation
    // If validation fails, return an error response
    const validate = createHabitValidation(habitData);
    if (validate.error) {
      const { details } = validate.error;
      const message = details.map((i) => i.message).join(",");
      logger.error(message);
      return res.status(400).json({ status: false, massage: message })
    }

    // Check if a habit with the same name already exists for the user
    const existingHabit = await Habit.findOne({ name: habitData.name, user: user._id });
    if (existingHabit) {
      throw new HabitAlreadyExistError(habitData.name);
    }
    // Create and save the new habit
    const habitDetails={
      date:new Date(),
      status:status.None

    }
    const newHabit = new Habit({ ...habitData, user: user._id,habitDetails:[habitDetails] });
    await newHabit.save();

    req.flash("success_msg", 'Habit Created Succesfully');
    return res.redirect("back");
  } catch (error) {
    logger.error(error);
    req.flash("error_msg", error.message);
    return res.redirect("back");
  }
};


export const findHabitById = async (req, res, next) => {
  try {
    let habitId = req?.params?.id;
    let userId = res?.locals?.user?.id;

    const habit = await Habit.findById(habitId).lean() ;
    if (!habit) {
      throw new HabitNotFoundError();
    }
    // Check if userId, habitId, and user's rights are valid
    if (!userId || !habitId || !(await checkRight(userId, habitId))) {
      throw new ActionForbiddenError();
    }
    let currentDate = new Date().setHours(0, 0, 0, 0);
    let prevDate = new Date(
      currentDate - 6 * 24 * 60 * 60 * 1000
    ).getTime();

    let habitCreatedAt = new Date(habit.createdAt).setHours(0, 0, 0, 0);
    if (habitCreatedAt && habitCreatedAt >= prevDate) {
      prevDate = habitCreatedAt;
    }

    prevDate=new Date(prevDate);
    currentDate=new Date(currentDate);
    let newHabitDetails=[]
    while (prevDate <= currentDate) {
      const isStatusExist=isExist(habit.habitDetails,prevDate)
      if (!isStatusExist) {
          let habitDetails={
            date:new Date(prevDate),
            status:status.None
          }
          newHabitDetails.push(habitDetails)
      }else{
          newHabitDetails.push({date:isStatusExist.date,status:isStatusExist.status})
      }
      let newDate = prevDate.setDate(prevDate.getDate() + 1);
      prevDate = new Date(newDate);
    }
    habit.habitDetails=newHabitDetails;
    res.render("_habitDetails", { habit });
  } catch (error) {
    logger.error(error);
    req.flash("error_msg", error.message);
    return res.redirect("back");
  }
};

export const updateHabit = async (req,res,next) => {

  try {
    const validate = updateHabitValidation(req.body);
    if (validate.error) {
      let { details } = validate.error;
      const message = details.map((i) => i.message).join(",");
      logger.error(message);
      return res.status(400).json({ status: false, massage: message })
    }
    let habitId = req.params.id;
    let userId = res?.locals?.user?.id;

    // Check if userId, habitId, and user's rights are valid
    if (!userId || !habitId || !(await checkRight(userId, habitId))) {
      throw new ActionForbiddenError();
    }

    let habit =await Habit.findById(habitId)
    if (!habit) {
        throw new HabitNotFoundError();
    }
    const updatedDoc = await Habit.findOneAndUpdate(
      { _id: habitId },  // Your query
      req.body,         //  New values to set
      { new: true }    //   Return the updated document
    );
    req.flash("success_msg", 'Habit updates Succesfully');
    return res.redirect("back");
  } catch (error) {
    logger.error(error);
    req.flash("error_msg", error.message);
    return res.redirect("back")
  }

}

export const updateHabitfav = async (req,res) => {

  try {

    let habitId = req.params.id;
    let userId = res?.locals?.user?.id;

    // Check if userId, habitId, and user's rights are valid
    if (!userId || !habitId || !(await checkRight(userId, habitId))) {
      throw new ActionForbiddenError();
    }

    let habit =await Habit.findById(habitId)
    if (!habit) {
        throw new HabitNotFoundError();
    }
    const updatedDoc = await Habit.findOneAndUpdate(
      { _id: habitId },  // Your query
      {favorite:!habit.favorite},//  New values to set
      { new: true }    //   Return the updated document
    );
    req.flash("success_msg", 'Habit updates Succesfully');
    return res.redirect("back");
  } catch (error) {
    logger.error(error);
    req.flash("error_msg", error.message);
    return res.redirect("back")
  }

}

export const changeStatus=async(req,res,next)=>{
  try {
    let userId = res?.locals?.user?.id;
    let habitId=req.params.id;
    
    const validate = updateHabitStatusValidation(req.query);
    if (validate.error) {
      let { details } = validate.error;
      const message = details.map((i) => i.message).join(",");
      logger.error(message);
      return res.status(400).json({ status: false, massage: message })
    }

    // Check if userId, habitId, and user's rights are valid
    if (!userId || !habitId || !(await checkRight(userId, habitId))) {
      throw new ActionForbiddenError();
    }
    const habit=await Habit.findById(habitId);

    const isStatusExist = habit.habitDetails.some((value) => {
      const valueDate = new Date(value.date);
      const requestBodyDate = new Date(req.query.date);
    
      // Remove the time portion and compare dates
      valueDate.setHours(0, 0, 0, 0);
      requestBodyDate.setHours(0, 0, 0, 0);
      if (valueDate.getTime() === requestBodyDate.getTime()) {
        value.status=(value.status+1)%3;
        return true
      }
      return false;
    });
    if (isStatusExist) {
      await habit.save();
      req.flash("success_msg", 'Habit status updates Succesfully');
      return res.redirect("back");
    }

    const habitDetails={
      date:req.query.date,
      status:status.Done
    }
    habit.habitDetails.push(habitDetails);
    await habit.save();
    req.flash("success_msg", 'Habit status updates Succesfully');
    return res.redirect("back");
  } catch (error) {
    logger.error(error);
    req.flash("error_msg", error.message);
    return res.redirect("back")
  }
}

export const deleteHabit = async (req, res, next) => {
  let userId = res?.locals?.user?.id;
  let habitId = req.params.id;

  // Check if userId, habitId, and user's rights are valid
  if (!userId || !habitId || !(await checkRight(userId, habitId))) {
    throw new ActionForbiddenError();
  }

  try {
    // Find the habit by ID
    const habit = await Habit.findById(habitId);

    if (!habit) {
      throw new HabitNotFoundError();
    }

    // Delete the habit
    await Habit.deleteOne({ _id: habit._id });

    // Respond with a success message
    req.flash("success_msg", 'Habit delete Succesfully');
    return res.redirect("back");
  } catch (error) {
    logger.error(error);
    req.flash("error_msg", error.message);
    return res.redirect("back")
  }
};

const checkRight = async (userId, habitId) => {
  try {
    const habit = await Habit.findById(habitId)?.populate("user");
    if (habit.user.id === userId) {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};

const isExist = (habitDetails, date) => {
  if (!habitDetails || habitDetails.length === 0) {
    return false;
  }
  const isStatusExist = habitDetails.filter((value) => {
    const valueDate = new Date(value.date);
    const target = new Date(date);

    // Remove the time portion and compare dates
    valueDate.setHours(0, 0, 0, 0);
    target.setHours(0, 0, 0, 0);

    return valueDate.getTime() === target.getTime();
  });
  return isStatusExist[0];
};
