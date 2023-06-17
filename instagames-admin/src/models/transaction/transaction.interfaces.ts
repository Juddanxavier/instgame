import mongoose, { Document, Model } from 'mongoose';

import { AccessAndRefreshTokens } from '@/models/token/token.interfaces';
import { QueryResult } from '@/utils/paginate/paginate';

interface StageType {
  status: string;
}

export interface ITransaction {
  user: mongoose.Types.ObjectId;
  type: string;
  paymentMethod: string;
  storage: string;
  stage: StageType[];
  quantity: number;
  product: string;
}
export interface ITransactionStatusSchema {
  title: string;
  step: number;
  status: string;
  timestamp: Date;
}

export interface ITransactionDoc extends ITransaction, Document {}
export interface ITransactionStatusSchemaDoc
  extends ITransactionStatusSchema,
    Document {}

export interface ITransactionModel extends Model<ITransactionDoc> {
  paginate(
    filter: Record<string, any>,
    options: Record<string, any>
  ): Promise<QueryResult>;
}
export interface ITransactionStatusSchemaModel
  extends Model<ITransactionStatusSchemaDoc> {
  paginate(
    filter: Record<string, any>,
    options: Record<string, any>
  ): Promise<QueryResult>;
}

export type UpdateTransactionBody = Partial<ITransaction>;

export type NewRegisteredTransaction = Omit<
  ITransaction,
  | 'role'
  | 'isEmailVerified'
  | 'isPhoneVerified'
  | 'balance'
  | 'aadharNumber'
  | 'email'
>;

export type NewCreatedTransaction = Omit<ITransaction, 'product'>;

export interface ITransactionWithTokens {
  user: ITransactionDoc;
  tokens: AccessAndRefreshTokens;
}
