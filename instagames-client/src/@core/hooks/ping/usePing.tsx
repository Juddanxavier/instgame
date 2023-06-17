import { useMutation } from 'react-query'

import PingServices from '@/services/ping/PingServices'

const { pingServer } = new PingServices()

export function usePing() {
  return useMutation(() => pingServer())
}
