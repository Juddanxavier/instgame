import { LoginData } from '@/@core/hooks/auth/login/useLogin.types'
import { RegisterParams } from '@/@core/hooks/auth/register/useRegister.types'

import { callApi } from '@/utils/apiUtils'
import userEndpoints from '@/utils/endpoints/auth'

import { CreateTokenResponse, VerifyResponse } from './AuthServices.types'

class AuthServices {
  public login = async (payload: LoginData) => {
    return callApi<CreateTokenResponse>({
      uriEndPoint: {
        ...userEndpoints.accessSignin,
        headerProps: {
          apiKey: btoa(`${payload.phone}:${payload.password}`)
        }
      }
    }).catch((error: any) => {
      console.log(error)
      throw error
    })
  }

  public verify = async () => {
    return callApi<VerifyResponse>({
      uriEndPoint: {
        ...userEndpoints.verify
      }
    }).catch((error: any) => {
      throw error
    })
  }

  public register = async (payload: RegisterParams) => {
    return callApi<CreateTokenResponse>({
      uriEndPoint: {
        ...userEndpoints.register,
        headerProps: {
          payload: btoa(`${payload.name}:${payload.phone}:${payload.password}:${payload.type}:${payload.role}`)
        }
      }
    })
      .then(tokenResponse => {
        return tokenResponse
      })
      .catch((error: any) => {
        return error
      })
  }

  public logout = async () => {
    return callApi<CreateTokenResponse>({
      uriEndPoint: {
        ...userEndpoints.accessLogout
      }
    })
      .then(logoutResponse => {
        return logoutResponse
      })
      .catch((error: any) => {
        throw error
      })
  }
}
export default AuthServices
