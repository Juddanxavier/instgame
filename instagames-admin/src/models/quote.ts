export type QuoteStatus = 'all' | 'completed' | 'requested';

export type TypeStatus = 'withdraw' | 'deposit';

export interface Image {
  url: string;
  thumbnailUrl: string;
}
export interface User {
  type: any[];
  isVerified: boolean;
  role: string;
  _id: string;
  name: string;
  created_at: Date;
  updated_at: Date;
  __v: number;
}

export interface Request {
  image: Image;
  status: QuoteStatus;
  _id: string;
  amount: number;
  type: TypeStatus;
  user: User;
  __v: number;
  createdAt: Date;
  updatedAt: Date;
}
