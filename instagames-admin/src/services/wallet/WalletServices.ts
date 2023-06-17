// import { LoginParams } from '@/hooks/auth/login/useLogin.types';

import { callApi } from '@/utils/apiUtils';
import walletEndpoints from '@/utils/endpoints/wallet';

// import { CreateTokenResponse, VerifyResponse } from './AuthServices.types';

class WalletServices {
  public wallet = async ({ pathParams }) => {
    return callApi({
      uriEndPoint: {
        ...walletEndpoints.wallet,
      },
      pathParams,
    }).catch((error: any) => {
      throw error;
    });
  };
  public updateWallet = async ({ body, pathParams }) => {
    return callApi({
      uriEndPoint: {
        ...walletEndpoints.updateWallet,
      },
      pathParams,
      body,
    }).catch((error: any) => {
      throw error;
    });
  };

  public myWallet = async () => {
    return callApi({
      uriEndPoint: {
        ...walletEndpoints.myWallet,
      },
    }).catch((error: any) => {
      throw error;
    });
  };
  public getWalletSetting = async () => {
    return callApi({
      uriEndPoint: {
        ...walletEndpoints.getWalletSetting,
      },
    }).catch((error: any) => {
      throw error;
    });
  };
  public updateWalletSetting = async ({ body }) => {
    return callApi({
      uriEndPoint: {
        ...walletEndpoints.updateWalletSetting,
      },
      body,
    }).catch((error: any) => {
      throw error;
    });
  };
}
export default WalletServices;
