import updateHabitValidation from "../../validations/habitValidations/updateHabit.validation.js";
import logger from "../../lib/logger/logger.js";
import Habit from "../../models/habit.js";
import { HabitNotFoundError } from "../../errors/habit.error.js";
import { ActionForbiddenError } from "../../errors/actionForbidden.error.js";


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