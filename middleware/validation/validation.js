import Joi from 'joi';

const blogCreationSchema = Joi.object({
  title: Joi.string().min(3).required(),
  content: Joi.string().min(10).required(),
});
const queriesSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  message: Joi.string().min(6).required(),
});
const userCreationSchema = Joi.object({
  username: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(16),
});
const commentsSchema = Joi.object({
  comment: Joi.string().min(3).max(100).required(),
});

export {
  blogCreationSchema,
  queriesSchema,
  userCreationSchema,
  commentsSchema,
};
