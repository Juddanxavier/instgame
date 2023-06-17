import { useMutation } from 'react-query';

import PingServices from '@/services/ping/PingServices';

const { pingServer, testServer } = new PingServices();

export function usePing() {
  return useMutation(() => pingServer());
}

export function useTest() {
  return useMutation(() => testServer());
}
