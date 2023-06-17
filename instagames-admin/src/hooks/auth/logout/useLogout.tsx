import { useMutation } from 'react-query';

import AuthServices from '@/services/auth/AuthServices';

const { logout } = new AuthServices();

export function useLogout() {
  return useMutation(() => logout());
}
