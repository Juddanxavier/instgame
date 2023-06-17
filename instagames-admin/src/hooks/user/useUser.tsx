import { useMutation } from 'react-query';

import UserServices from '@/services/user/UserServices';

const {
  createUser,
  updateUser,
  updateUserData,
  getAllUsers,
  getMyUser,
  getUser,
  deleteUser,
  updateBank,
  updateContact,
} = new UserServices();

export function useGetAllUsers() {
  return useMutation((keyword: any) => getAllUsers(keyword));
}

export function useGetMyUser() {
  return useMutation(() => getMyUser());
}

export function useGetUser() {
  return useMutation((payload: any) => getUser(payload));
}

export function useUpdateBank() {
  return useMutation((payload: any) => updateBank(payload));
}

export function useUpdateContact() {
  return useMutation((payload: any) => updateContact(payload));
}

export function useCreateUser() {
  return useMutation((data: any) => createUser(data));
}

export function useUpdateUserData() {
  return useMutation((payload: any) => updateUserData(payload));
}

export function useUpdateUser() {
  return useMutation(({ user, data }: any) => updateUser({ user, data }));
}

export function useDeleteUser() {
  return useMutation((payload: any) => deleteUser(payload));
}
