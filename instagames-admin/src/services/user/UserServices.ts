// import { LoginParams } from '@/hooks/auth/login/useLogin.types';

import { RegisterParams } from '@/hooks/auth/register/useRegister.types';

import { callApi } from '@/utils/apiUtils';
import userEndpoints from '@/utils/endpoints/customers';

import { CreateTokenResponse } from '../auth/AuthServices.types';

// import { CreateTokenResponse, VerifyResponse } from './AuthServices.types';

class UserServices {
  public getAllUsers = async ({ body, query }: any) => {
    return callApi({
      uriEndPoint: {
        ...userEndpoints.getAllUsers,
      },
      query,
      body,
    }).catch((error: any) => {
      throw error;
    });
  };

  public getMyUser = async () => {
    return callApi({
      uriEndPoint: {
        ...userEndpoints.getMyUser,
      },
    }).catch((error: any) => {
      throw error;
    });
  };

  public createUser = async ({ body, headers }: RegisterParams) => {
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

  public updateBank = async ({ data }: any) => {
    return callApi({
      uriEndPoint: {
        ...userEndpoints.updateBank,
      },
      body: data,
    }).catch((error: any) => {
      throw error;
    });
  };
  public updateContact = async ({ data }: any) => {
    return callApi({
      uriEndPoint: {
        ...userEndpoints.updateContact,
      },
      body: data,
    }).catch((error: any) => {
      throw error;
    });
  };

  public getUser = async ({ body, query, pathParams }: any) => {
    return callApi<CreateTokenResponse>({
      uriEndPoint: {
        ...userEndpoints.getUser,
      },
      pathParams,
      query,
      body,
    })
      .then((tokenResponse) => {
        return tokenResponse;
      })
      .catch((error: any) => {
        return error;
      });
  };

  public updateUser = async ({ user, data }: any) => {
    return callApi({
      uriEndPoint: {
        ...userEndpoints.updateUser,
      },
      query: {
        id: user,
      },
      body: data,
    }).catch((error: any) => {
      throw error;
    });
  };

  public updateUserData = async ({ query, body, pathParams }: any) => {
    return callApi({
      uriEndPoint: {
        ...userEndpoints.updateUserData,
      },
      pathParams,
      query,
      body,
    }).catch((error: any) => {
      throw error;
    });
  };

  public deleteUser = async ({ pathParams }: any) => {
    return callApi({
      uriEndPoint: {
        ...userEndpoints.deleteUser,
      },
      pathParams,
    }).catch((error: any) => {
      throw error;
    });
  };
}
export default UserServices;
