import { useMutation } from 'react-query';

import AuthServices from '@/services/auth/AuthServices';

import { LoginParams } from './useMenu.types';
const { login } = new AuthServices();

export function useLogin() {
  return useMutation((payload: LoginParams) => login(payload));
}
