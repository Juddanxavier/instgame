const Joi = require("joi");

const registerValidation = Joi.object({
  email: Joi.string().trim().email().lowercase(),
  phone: Joi.string()
    .trim()
    .regex(/^[0-9]{7,10}$/),
  name: Joi.string().min(3).max(30).required(),
  password: Joi.string().min(2).required(),
  type: Joi.string().valid("customer", "developer", "agent"),
  role: Joi.string().valid("user", "admin"),
  gender: Joi.string().valid("Male", "Female", "Others"),
  dob: Joi.date(),
});

const updateUserValidation = Joi.object({
  name: Joi.string().min(3).max(30),
  userHandle: Joi.string()
    .min(3)
    .max(20)
    .pattern(new RegExp(/(?:[(?:\d\w)]+[(?:_)]*)/)),
  gender: Joi.string().valid("male", "female", "others"),
});

const updateUserPrivacyValidation = Joi.object({
  is_private: Joi.boolean(),
});

const loginValidation = Joi.object({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(2).required(),
});

const emailValidation = Joi.object({
  email: Joi.string().email().lowercase().required(),
});

const passwordValidation = Joi.object({
  password: Joi.string().min(2).required(),
});

const createPostValidation = Joi.object({
  name: Joi.string().allow("").optional(),
  price: Joi.number(),
  mentions: Joi.string(),
});

const postRatingValidation = Joi.object({
  rating: Joi.number().greater(0).less(6).required(),
});

const createMessageGroupValidation = Joi.object({
  usersList: Joi.array(),
  type: Joi.string().valid("single", "group").required(),
  name: Joi.string().min(3).max(30),
  description: Joi.string().min(2).max(1000),
});

const createFollowRequestUpdateValidation = Joi.object({
  status: Joi.string().valid("accepted", "rejected").required(),
});

const getMessageGroupValidation = Joi.object({
  sender: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
  receiver: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
});

const getPostsStatsValidation = Joi.object({
  id: Joi.string().required(),
});

const newMessageValidation = Joi.object({
  conversationId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
  type: Joi.string().valid("image", "video", "audio", "text").required(),
  message: Joi.string().required(),
  sender: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
});

const newNotificationValidation = Joi.object({
  actor: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
  verb: Joi.string()
    .valid(
      "post",
      "rate",
      "comment",
      "follow-request",
      "follow-accept",
      "post-mention"
    )
    .required(),
  object: Joi.string().required(),
  receiver: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
});

const createGiftValidation = Joi.object({
  name: Joi.string().required(),
  cost: Joi.number().required(),
});
const paymentTypeValidation = Joi.object({
  type: Joi.string().required(),
  price: Joi.number().required(),
});

module.exports = {
  registerValidation,
  loginValidation,
  emailValidation,
  passwordValidation,
  postRatingValidation,
  updateUserValidation,
  createPostValidation,
  createMessageGroupValidation,
  getMessageGroupValidation,
  newMessageValidation,
  newNotificationValidation,
  createFollowRequestUpdateValidation,
  updateUserPrivacyValidation,
  createGiftValidation,
  paymentTypeValidation,
  getPostsStatsValidation,
};
