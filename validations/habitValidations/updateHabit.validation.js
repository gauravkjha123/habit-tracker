import joi from "joi";

const updateHabitValidation = (data) => {
  try {
    const Schema = joi
      .object({
        name: joi
          .string()
          .required()
          .messages({
            "string.base": "Please provide a valid email address",
            "any.required":
            "Email is required. Please provide an email address",
          }),
      })
      .unknown(false);

    return Schema.validate(data);
  } catch (error) {
    return result.status(400).json({ error: error.message });
  }
};

export default updateHabitValidation;
