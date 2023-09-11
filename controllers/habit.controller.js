import logger from "../lib/logger/logger.js";
import Habit from "../models/habit.js";
import { HabitNotFoundError } from "../errors/habit.error.js";
import { ActionForbiddenError } from "../errors/actionForbidden.error.js";
import { status } from "../enum/status.enum.js";


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
      new Date(currentDate).setHours(0, 0, 0, 0) - 7 * 24 * 60 * 60 * 1000
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
            date:prevDate,
            status:status.NotDone
          }
          newHabitDetails.push(habitDetails)
      }else{
          newHabitDetails.push({date:isStatusExist.date,status:isStatusExist.status})
      }
      let newDate = prevDate.setDate(prevDate.getDate() + 1);
      prevDate = new Date(newDate);
    }
    habit.habitDetails=newHabitDetails;
    return res.status(200).json({status:true,data:habit})
    res.render("habitDetails", { habit });
  } catch (error) {
    logger.error(error);
    next(error);
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
