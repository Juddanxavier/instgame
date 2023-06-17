import { EndPoint } from '@/types/endpoints';

const walletEndpoints: EndPoint = {
  wallet: {
    uri: '/wallet/:id',
    method: 'GET',
    version: '/api',
  },
  updateWallet: {
    uri: '/wallet/:id',
    method: 'POST',
    version: '/api',
  },
  myWallet: {
    uri: '/wallet/myWallet',
    method: 'GET',
    version: '/api',
  },
  getWalletSetting: {
    uri: '/wallet/walletSetting',
    method: 'GET',
    version: '/api',
  },
  updateWalletSetting: {
    uri: '/wallet/walletSetting',
    method: 'PUT',
    version: '/api',
  },
};

export default walletEndpoints;
