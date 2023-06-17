// import { LoginParams } from '@/hooks/auth/login/useLogin.types';

import { callApi } from '@/utils/apiUtils'
import walletEndpoints from '@/@core/utils/endpoints/wallet'

// import { CreateTokenResponse, VerifyResponse } from './AuthServices.types';

class WalletServices {
  public getMyWallet = async () => {
    return callApi({
      uriEndPoint: {
        ...walletEndpoints.getMyWallet
      }
    }).catch((error: any) => {
      throw error
    })
  }
  public getMyRequests = async () => {
    return callApi({
      uriEndPoint: {
        ...walletEndpoints.getMyRequests
      }
    }).catch((error: any) => {
      throw error
    })
  }
  public depositRequest = async (data: any) => {
    return callApi({
      uriEndPoint: {
        ...walletEndpoints.depositRequest
      },
      body: data
    }).catch((error: any) => {
      throw error
    })
  }
  public withdrawRequest = async (data: any) => {
    return callApi({
      uriEndPoint: {
        ...walletEndpoints.withdrawRequest
      },
      body: data
    }).catch((error: any) => {
      throw error
    })
  }
  public getWalletSetting = async () => {
    return callApi({
      uriEndPoint: {
        ...walletEndpoints.getWalletSetting
      }
    }).catch((error: any) => {
      throw error
    })
  }
  public updateWallet = async ({ wallet, data }: any) => {
    return callApi({
      uriEndPoint: {
        ...walletEndpoints.updateWallet
      },
      query: {
        id: wallet
      },
      body: data
    }).catch((error: any) => {
      throw error
    })
  }
}
export default WalletServices
