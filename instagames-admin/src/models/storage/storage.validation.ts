/* eslint-disable no-useless-escape */
import Joi from 'joi';

import { objectId, password } from '@/utils/validate/custom.validation';

import { NewCreatedStorage } from './storage.interfaces';

const createStorageBody: Record<keyof NewCreatedStorage, any> = {
  user: Joi.string().required(),
  quantity: Joi.number(),
};

export const createStorage = {
  body: Joi.object().keys(createStorageBody),
};

export const getStorages = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    projectBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

export const getStorage = {
  params: Joi.object().keys({
    storageId: Joi.string().custom(objectId),
  }),
};

export const updateStorage = {
  params: Joi.object().keys({
    storageId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      password: Joi.string().custom(password),
      name: Joi.string(),
    })
    .min(1),
};

export const deleteStorage = {
  params: Joi.object().keys({
    storageId: Joi.string().custom(objectId),
  }),
};
