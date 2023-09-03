import Joi from 'joi';

const registrationSchema = Joi.object({
  email: Joi.string().email({ tlds: false }).required(),
  password: Joi.string().required().min(4).max(10),
  name: Joi.string().required(),
  confirm_password: Joi.string().required().valid(Joi.ref('password'))
});

export default registrationSchema;
