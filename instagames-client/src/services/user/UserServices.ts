// import { LoginParams } from '@/hooks/auth/login/useLogin.types';

import userEndpoints from '@/@core/utils/endpoints/user'
import { callApi } from '@/utils/apiUtils'

// import { CreateTokenResponse, VerifyResponse } from './AuthServices.types';

class UserServices {
  public getAllUsers = async (keyword: any) => {
    return callApi({
      uriEndPoint: {
        ...userEndpoints.getAllUsers
      },
      body: {
        keyword
      }
    }).catch((error: any) => {
      throw error
    })
  }
  public getMyUser = async () => {
    return callApi({
      uriEndPoint: {
        ...userEndpoints.getMyUser
      }
    }).catch((error: any) => {
      throw error
    })
  }
  public createUser = async (data: any) => {
    return callApi({
      uriEndPoint: {
        ...userEndpoints.createUser
      },
      body: data
    }).catch((error: any) => {
      throw error
    })
  }

  public updateUser = async ({ data }: any) => {
    return callApi({
      uriEndPoint: {
        ...userEndpoints.updateUser
      },
      body: data
    }).catch((error: any) => {
      throw error
    })
  }
  public updateBank = async ({ data }: any) => {
    return callApi({
      uriEndPoint: {
        ...userEndpoints.updateBank
      },
      body: data
    }).catch((error: any) => {
      throw error
    })
  }
  public updateContact = async ({ data }: any) => {
    return callApi({
      uriEndPoint: {
        ...userEndpoints.updateContact
      },
      body: data
    }).catch((error: any) => {
      throw error
    })
  }

  public updateUserBank = async ({ user, data }: any) => {
    return callApi({
      uriEndPoint: {
        ...userEndpoints.updateUserBank
      },
      pathParams: {
        id: user
      },
      body: data
    }).catch((error: any) => {
      throw error
    })
  }
}
export default UserServices
