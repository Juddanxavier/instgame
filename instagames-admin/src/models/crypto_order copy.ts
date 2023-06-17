export type RequestStatus =
  | 'completed'
  | 'pending'
  | 'failed'
  | 'notinitialized';

export interface Image {
  url: string;
  thumbnailUrl: string;
}

export interface Request {
  image: Image;
  status: RequestStatus;
  _id: string;
  type: string;
  user: string;
  __v: number;
  createdAt: Date;
  updatedAt: Date;
}
