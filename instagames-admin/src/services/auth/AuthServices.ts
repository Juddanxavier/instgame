import { LoginData } from '@/hooks/auth/login/useLogin.types';
import { RegisterParams } from '@/hooks/auth/register/useRegister.types';

import { callApi } from '@/utils/apiUtils';
import userEndpoints from '@/utils/endpoints/auth';

import { CreateTokenResponse } from './AuthServices.types';

class AuthServices {
  public login = async (payload: LoginData) => {
    return callApi<CreateTokenResponse>({
      uriEndPoint: {
        ...userEndpoints.accessSignin,
        headerProps: {
          apiKey: btoa(`${payload.phone}:${payload.password}:${payload.role}`),
        },
      },
    }).catch((error: any) => {
      console.log(error);
      throw error;
    });
  };

  public register = async ({ headers, body }: RegisterParams) => {
    return callApi<CreateTokenResponse>({
      uriEndPoint: {
        ...userEndpoints.register,
        headerProps: {
          payload: btoa(
            `${headers.name}:${headers.phone}:${headers.password}:${headers.type}:${headers.role}`
          ),
        },
      },
      body,
    })
      .then((tokenResponse) => {
        return tokenResponse;
      })
      .catch((error: any) => {
        return error;
      });
  };

  public logout = async () => {
    return callApi<CreateTokenResponse>({
      uriEndPoint: {
        ...userEndpoints.accessLogout,
      },
    })
      .then((logoutResponse) => {
        return logoutResponse;
      })
      .catch((error: any) => {
        throw error;
      });
  };
}
export default AuthServices;
