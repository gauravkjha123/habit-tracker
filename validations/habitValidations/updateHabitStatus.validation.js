import joi from "joi";


const updateHabitStatusValidation = (data) => {
  try {
    const Schema = joi.object({
        date: joi.date()
      }).unknown(false);
    return Schema.validate(data);
  } catch (error) {
    return result.status(400).json({ error: error.message });
  }
};

export default updateHabitStatusValidation;
