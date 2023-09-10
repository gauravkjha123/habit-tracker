export const findHabitById = async (req, res, next) => {
    try {
      const habitId = req.params.id;
      const habit = await Habit.findById(habitId);
  
      if (!habit) {
        throw new HabitNotFoundError("Habit not found.");
      }
  
      res.render('habitDetails', { habit });
    } catch (error) {
      logger.error(error)
      next(error);
    }
  };
  