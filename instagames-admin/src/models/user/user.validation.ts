import Joi from 'joi';

import { roles } from '@/utils/config/roles';
import { objectId, password } from '@/utils/validate/custom.validation';

import { NewCreatedUser } from './user.interfaces';

export const createUserBody: Record<keyof NewCreatedUser, any> = {
  // email: Joi.string().email(),
  uId: Joi.string().required(),
  phone: Joi.string().regex(
    /^(\+\d{1,2}\s?)?1?-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/m
  ),
  referenceUid: Joi.string(),
  password: Joi.string().required().custom(password),
  name: Joi.string().required(),
  role: Joi.string().valid(...roles),
};

export const createUser = {
  body: Joi.object().keys(createUserBody),
};

export const getUsers = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    projectBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

export const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

// export const loginUser = {
//   header: Joi.string()
// }

// export const updateUser = {
//   params: Joi.object().keys({
//     userId: Joi.required().custom(objectId),
//   }),
//   body: Joi.object()
//     .keys({
//       street: Joi.string(),
//       aptOrLocality: Joi.string(),

//       // email: Joi.string().email(),
//       password: Joi.string().custom(password),
//       name: Joi.string(),
//     })
//     .min(1),
// };

export const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};
