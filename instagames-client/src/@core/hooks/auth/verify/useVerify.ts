import { useMutation } from 'react-query'

import AuthServices from '@/services/auth/AuthServices'

const { verify } = new AuthServices()

export function useVerify() {
  return useMutation(() => verify())
}
