import { useMutation } from 'react-query';

import RequestServices from '@/services/request/RequestServices';

const {
  depositRequest,
  getAllRequests,
  getSingleRequest,
  revertRequest,
  updateRequest,
} = new RequestServices();

export function useAllRequests() {
  return useMutation((payload: any) => getAllRequests(payload));
}

export function useUpdateRequest() {
  return useMutation((payload: any) => updateRequest(payload));
}

export function useDepositRequest() {
  return useMutation((payload: any) => depositRequest(payload));
}

export function useRevertRequest() {
  return useMutation((payload: any) => revertRequest(payload));
}

export function useRequest() {
  return useMutation((payload: any) => getSingleRequest(payload));
}
