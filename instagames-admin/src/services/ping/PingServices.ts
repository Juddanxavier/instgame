// import { LoginParams } from '@/hooks/auth/login/useLogin.types';

import { callApi } from '@/utils/apiUtils';
import pingEndpoints from '@/utils/endpoints/ping';

// import { CreateTokenResponse, VerifyResponse } from './AuthServices.types';

class PingServices {
  public pingServer = async () => {
    return callApi({
      uriEndPoint: {
        ...pingEndpoints.pingServer,
      },
    }).catch((error: any) => {
      throw error;
    });
  };

  public testServer = async () => {
    return callApi({
      uriEndPoint: {
        ...pingEndpoints.testServer,
      },
    }).catch((error: any) => {
      throw error;
    });
  };
}
export default PingServices;
