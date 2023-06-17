import { useMutation } from 'react-query';

import WalletServices from '@/services/wallet/WalletServices';

const {
  wallet,
  myWallet,
  updateWallet,
  getWalletSetting,
  updateWalletSetting,
} = new WalletServices();

export function useWallet() {
  return useMutation((payload: any) => wallet(payload));
}
export function useUpdateWallet() {
  return useMutation((payload: any) => updateWallet(payload));
}

export function useGetMyWallet() {
  return useMutation(() => myWallet());
}

export function useGetMyWalletSetting() {
  return useMutation(() => getWalletSetting());
}

export function useUpdateMyWalletSetting() {
  return useMutation((payload: any) => updateWalletSetting(payload));
}
