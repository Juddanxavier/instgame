import mongoose, { Document, Model } from 'mongoose';

import { AccessAndRefreshTokens } from '@/models/token/token.interfaces';
import { QueryResult } from '@/utils/paginate/paginate';

export interface IRequest {
  name: string;
  uId: string;
  phone: string;
  password: string;
  role?: string;
  referenceUid: string;
  isPhoneVerified?: boolean;
}

export interface IRequestDoc extends IRequest, Document {
  isPasswordMatch(password: string): Promise<boolean>;
}

export interface IRequestModel extends Model<IRequestDoc> {
  isPhoneTaken(
    phone: string,
    excludeRequestId?: mongoose.Types.ObjectId
  ): Promise<boolean>;
  paginate(
    filter: Record<string, any>,
    options: Record<string, any>
  ): Promise<QueryResult>;
}

export type UpdateRequestBody = Partial<IRequest>;

export type NewRegisteredRequest = Omit<
  IRequest,
  'role' | 'isPhoneVerified' | 'password'
>;

// export type NewCreatedRequest = Omit<IRequest, 'isEmailVerified' | 'isPhoneVerified'>;
export type NewCreatedRequest = Omit<IRequest, 'isPhoneVerified'>;

export interface IRequestWithTokens {
  request: IRequestDoc;
  tokens: AccessAndRefreshTokens;
}
