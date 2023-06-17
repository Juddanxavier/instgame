import { atom } from 'jotai'

export interface User {
  type: string
  isVerified: boolean
  role: string
  _id: string
  name: string
  createdAt: Date
  updatedAt: Date
  __v: number
  iat: number
  exp: number
}

export interface Bank {
  _id: string
  user: string
  createdAt: Date
  updatedAt: Date
  __v: number
  accNo: string
  bankName: string
  ifsc: string
  registeredName: string
}

export interface Contact {
  _id: string
  user: string
  contactType: string
  contactValue: string
  createdAt: Date
  updatedAt: Date
  __v: number
}

export interface CreateUserResponse {
  type: string
  status: string
  message: string
  user: User
}

export interface Wallet {
  balance: number
  _id: string
  user: User
  created_at: Date
  updated_at: Date
  __v: number
}

// Create your atoms and derivatives
export const userAtom = atom<User | undefined>(undefined)
export const bankAtom = atom<Bank | undefined>(undefined)
export const contactAtom = atom<Contact | undefined>(undefined)
export const walletAtom = atom<Wallet | undefined>(undefined)
