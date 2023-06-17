import { atom } from 'jotai';

import { Wallet } from '../content/Management/Requests/SingleRequest/MiniWalletDeposit';
import { Permission } from '../content/Management/Staff/UpdateUser/index';

export interface User {
  type: string;
  isVerified: boolean;
  role: string;
  _id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
  iat: number;
  exp: number;
  bank: Bank;
  contact: Contact;
  wallet: Wallet;
  permissions: Permission[];
}

export interface Bank {
  _id: string;
  user: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
  accNo: string;
  bankName: string;
  ifsc: string;
  registeredName: string;
}

export interface Contact {
  _id: string;
  user: string;
  contactType: string;
  contactValue: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

export interface CreateUserResponse {
  type: string;
  status: string;
  message: string;
  user: User;
}
// Create your atoms and derivatives
export const userAtom = atom<User | undefined>(undefined);
export const bankAtom = atom<Bank | undefined>(undefined);
export const contactAtom = atom<Contact | undefined>(undefined);
