import { useMutation } from 'react-query'

import WalletServices from '@/services/wallet/WalletServices'

const { depositRequest, updateWallet, getMyWallet, getMyRequests, withdrawRequest, getWalletSetting } =
  new WalletServices()

export function useGetMyWallet() {
  return useMutation(() => getMyWallet())
}

export function useUpdateWallet() {
  return useMutation(({ wallet, data }: any) => updateWallet({ wallet, data }))
}

export function useDepositRequest() {
  return useMutation((requests: any) => depositRequest(requests))
}

export function useWithdrawRequest() {
  return useMutation((requests: any) => withdrawRequest(requests))
}

export function useGetMyRequests() {
  return useMutation(() => getMyRequests())
}

export function useGetMyWalletSetting() {
  return useMutation(() => getWalletSetting())
}
