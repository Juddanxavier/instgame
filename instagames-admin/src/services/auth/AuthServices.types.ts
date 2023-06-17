export interface AccessToken {
  name: string;
  value: string;
  expiresIn: number;
}

export interface RefreshToken {
  name: string;
  value: string;
  expiresIn: number;
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

export interface CreateTokenResponse {
  type: string;
  status: string;
  accessToken: AccessToken;
  refreshToken: RefreshToken;
  message: string;
  user: User;
}
