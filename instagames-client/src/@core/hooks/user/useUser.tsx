import { useMutation } from 'react-query'

import UserServices from '@/services/user/UserServices'

const { createUser, updateUserBank, getAllUsers, getMyUser, updateUser, updateBank, updateContact } = new UserServices()

export function useGetAllUsers() {
  return useMutation((keyword: any) => getAllUsers(keyword))
}

export function useGetMyUser() {
  return useMutation(() => getMyUser())
}

export function useUpdateUser() {
  return useMutation((payload: any) => updateUser(payload))
}

export function useUpdateBank() {
  return useMutation((payload: any) => updateBank(payload))
}

export function useUpdateContact() {
  return useMutation((payload: any) => updateContact(payload))
}

export function useCreateUser() {
  return useMutation((data: any) => createUser(data))
}

export function useUpdateUserBank() {
  return useMutation(({ user, data }: any) => updateUserBank({ user, data }))
}
