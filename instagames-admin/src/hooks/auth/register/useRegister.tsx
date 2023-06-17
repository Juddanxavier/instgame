import { useMutation } from 'react-query';

import AuthServices from '@/services/auth/AuthServices';

import { RegisterParams } from './useRegister.types';
const { register } = new AuthServices();

export function useRegister() {
  return useMutation((payload: RegisterParams) => register(payload));
}
