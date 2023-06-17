// import { LoginParams } from '@/hooks/auth/login/useLogin.types';

import { callApi } from '@/utils/apiUtils';
import requestEndpoints from '@/utils/endpoints/request';

// import { CreateTokenResponse, VerifyResponse } from './AuthServices.types';

class RequestServices {
  public getSingleRequest = async ({ pathParams }) => {
    return callApi({
      uriEndPoint: {
        ...requestEndpoints.getSingleRequests,
      },
      pathParams,
    }).catch((error: any) => {
      throw error;
    });
  };
  public updateRequest = async ({ pathParams, body, query }) => {
    return callApi({
      uriEndPoint: {
        ...requestEndpoints.updateRequest,
      },
      pathParams,
      body,
      query,
    }).catch((error: any) => {
      throw error;
    });
  };
  public depositRequest = async ({ body, query }: any) => {
    return callApi({
      uriEndPoint: {
        ...requestEndpoints.depositRequest,
      },
      body,
      query,
    }).catch((error: any) => {
      throw error;
    });
  };
  public revertRequest = async ({ pathParams, body, query }) => {
    return callApi({
      uriEndPoint: {
        ...requestEndpoints.revertRequest,
      },
      pathParams,
      body,
      query,
    }).catch((error: any) => {
      throw error;
    });
  };
  public getAllRequests = async ({ body, query }) => {
    return callApi({
      uriEndPoint: {
        ...requestEndpoints.getAllRequests,
      },
      body,
      query,
    }).catch((error: any) => {
      throw error;
    });
  };

  public testServer = async () => {
    return callApi({
      uriEndPoint: {
        ...requestEndpoints.testServer,
      },
    }).catch((error: any) => {
      throw error;
    });
  };
}
export default RequestServices;
