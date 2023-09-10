import createHabitValidation from "../../validations/habitValidations/createHabit.validation.js";
import updateHabitValidation from "../../validations/habitValidations/updateHabit.validation.js";
import updateHabitStatusValidation from "../../validations/habitValidations/updateHabitStatus.validation.js";
import logger from "../../lib/logger/logger.js";
import Habit from "../../models/habit.js";
import { HabitNotFoundError, HabitAlreadyExistError } from "../../errors/habit.error.js";
import { ActionForbiddenError } from "../../errors/actionForbidden.error.js";
import { status } from "../../enum/status.enum.js";

export const findHabits = async (req, res, next) => {
  try {
    const { user } = req;
    const habits = await Habit.find({ user: user._id });
    res.status(200).json({ status: true, data: habits });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

export const createHabit = async (req, res, next) => {
  try {
    const { user } = req;
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
      status:status.NotDone

    }
    const newHabit = new Habit({ ...habitData, user: user._id,habitDetails:habitDetails });
    await newHabit.save();

    res.status(201).json({ status: true, data: newHabit });
  } catch (error) {
    logger.error(error)
    next(error);
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
    let userId =req.user.id;

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
    return res.status(200).json({ status: true, data: updatedDoc })
  } catch (error) {
    logger.error(error);
    logger.error(error)
    next(error)
  }

}

export const deleteHabit = async (req, res, next) => {
  let userId = req.user.id;
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
    return res.status(200).json({ status: true, message: 'Habit deleted successfully' });
  } catch (error) {
    logger.error(error)
    next(error);
  }
};

export const changeStatus=async(req,res,next)=>{
  try {
    let userId=req.user.id;
    let habitId=req.params.id;
    
    const validate = updateHabitStatusValidation(req.body);
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
      const requestBodyDate = new Date(req.body.date);
    
      // Remove the time portion and compare dates
      valueDate.setHours(0, 0, 0, 0);
      requestBodyDate.setHours(0, 0, 0, 0);
    
      return valueDate.getTime() === requestBodyDate.getTime();
    });
    
    if (isStatusExist) {
      const updatedHabit = await Habit.findOneAndUpdate(
        { _id: habitId, 'habitDetails.date': req.body.date },
        { $set: { 'habitDetails.$.status': req.body.status } },
        { new: true }
      );
      return res.status(422).json({status:true,data:updatedHabit})
    }

    const habitDetails={
      date:req.body.date,
      status:req.body.status
    }
    habit.habitDetails.push(habitDetails);
    await habit.save();
    return res.status(422).json({status:true,data:habit})
  } catch (error) {
    logger.error(error);
    next(error);
  }
}

const checkRight= async(userId,habitId)=>{
  try {
    const habit =await Habit.findById(habitId).populate('user');
    if (habit.user.id===userId) {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
}