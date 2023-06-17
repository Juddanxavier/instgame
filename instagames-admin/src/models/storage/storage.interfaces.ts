import mongoose, { Document, Model } from 'mongoose';

import { AccessAndRefreshTokens } from '@/models/token/token.interfaces';
import { QueryResult } from '@/utils/paginate/paginate';

export interface IStorage {
  user: mongoose.Types.ObjectId;
  quantity?: number;
  product?: string;
}

export interface IStorageDoc extends IStorage, Document {}

export interface IStorageModel extends Model<IStorageDoc> {
  paginate(
    filter: Record<string, any>,
    options: Record<string, any>
  ): Promise<QueryResult>;
}

export type UpdateStorageBody = Partial<IStorage>;

export type NewRegisteredStorage = Omit<
  IStorage,
  | 'role'
  | 'isEmailVerified'
  | 'isPhoneVerified'
  | 'balance'
  | 'aadharNumber'
  | 'email'
>;

export type NewCreatedStorage = Omit<IStorage, 'product'>;

export interface IStorageWithTokens {
  user: IStorageDoc;
  tokens: AccessAndRefreshTokens;
}
