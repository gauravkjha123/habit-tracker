import joi from "joi";
import { status } from "../../enum/status.enum.js";

const updateHabitStatusValidation = (data) => {
  try {
    const Schema = joi.object({
        status: joi.number()
          .valid(...Object.values(status)) // Use Object.values() to get the enum values from the 'status' object
          .required()
          .messages({
            "any.only": "Invalid status. Please provide a valid status",
            "any.required": "Status is required. Please provide a status",
          }),
        date: joi.date()
      }).unknown(false);
    return Schema.validate(data);
  } catch (error) {
    return result.status(400).json({ error: error.message });
  }
};

export default updateHabitStatusValidation;
