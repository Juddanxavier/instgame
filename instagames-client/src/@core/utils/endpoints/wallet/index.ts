import { EndPoint } from '@/types/endpoints'

const walletEndpoints: EndPoint = {
  getMyWallet: {
    uri: '/wallet/',
    method: 'GET',
    version: '/api'
  },
  getMyRequests: {
    uri: '/wallet/requests',
    method: 'GET',
    version: '/api'
  },
  depositRequest: {
    uri: '/wallet/depositRequest',
    method: 'POST',
    version: '/api'
  },
  getWalletSetting: {
    uri: '/wallet/walletSetting',
    method: 'GET',
    version: '/api'
  },
  withdrawRequest: {
    uri: '/wallet/withdrawRequest',
    method: 'POST',
    version: '/api'
  }
}

export default walletEndpoints
