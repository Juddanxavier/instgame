/* eslint-disable no-useless-escape */
import Joi from 'joi';

import { objectId, password } from '@/utils/validate/custom.validation';

import { NewCreatedTransaction } from './transaction.interfaces';

const createTransactionBody: Record<keyof NewCreatedTransaction, any> = {
  user: Joi.string().required(),
  quantity: Joi.number(),
  type: Joi.string().required(),
  storage: Joi.string().required(),
  paymentMethod: Joi.string(),
  stage: Joi.string(),
};

export const createTransaction = {
  body: Joi.object().keys(createTransactionBody),
};

export const getTransactions = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    projectBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

export const getTransaction = {
  params: Joi.object().keys({
    transactionId: Joi.string().custom(objectId),
  }),
};

export const updateTransaction = {
  params: Joi.object().keys({
    transactionId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      password: Joi.string().custom(password),
      name: Joi.string(),
    })
    .min(1),
};

export const deleteTransaction = {
  params: Joi.object().keys({
    transactionId: Joi.string().custom(objectId),
  }),
};
