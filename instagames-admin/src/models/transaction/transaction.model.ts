import { model, models, Schema } from 'mongoose';

import toJSON from '@/utils/toJSON/toJSON';

import {
  ITransactionDoc,
  ITransactionModel,
  ITransactionStatusSchemaDoc,
  ITransactionStatusSchemaModel,
} from './transaction.interfaces';

const TransactionStatusSchema = new Schema<
  ITransactionStatusSchemaDoc,
  ITransactionStatusSchemaModel
>({
  title: {
    type: String,
    enum: [
      'select add/withdraw',
      'add quantity',
      'validate storage',
      'select payment method',
      'validate transaction',
      'complete transaction',
    ],
    required: true,
  },
  step: { type: Number, enum: [0, 1, 2, 3, 4, 5], required: true },
  status: {
    type: String,
    enum: [
      'complete',
      'inprogress',
      'pending',
      'failed',
      'retry',
      'discarded',
      'initialized',
    ],
    required: true,
  },
  timestamp: { type: Date, default: Date.now, required: true },
});

export const TransactionStatus =
  models.TransactionStatus ||
  model<ITransactionStatusSchemaDoc, ITransactionStatusSchemaModel>(
    'TransactionStatus',
    TransactionStatusSchema
  );

const transactionSchema = new Schema<ITransactionDoc, ITransactionModel>(
  {
    user: {
      type: Schema.Types.ObjectId,
      trim: true,
      required: true,
    },
    stage: [{ type: Schema.Types.ObjectId, required: true }],
    type: {
      type: String,
      required: true,
      enum: ['deposit', 'withdraw'],
    },
    paymentMethod: { type: String, enum: ['UPI', 'cash'] },
    storage: {
      type: String,
    },
    quantity: {
      type: Number,
      default: 0,
    },
    product: {
      type: String,
      enum: ['wheat'],
      default: 'wheat',
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
transactionSchema.plugin(toJSON);
// transactionSchema.plugin(paginate);

const Transaction =
  models.Transaction ||
  model<ITransactionDoc, ITransactionModel>('Transaction', transactionSchema);

export default Transaction;
