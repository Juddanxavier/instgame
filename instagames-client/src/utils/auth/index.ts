import { EndPoint } from '@/types/endpoints'

const authEndpoints: EndPoint = {
  accessLogin: {
    uri: '/auth/login',
    method: 'POST',
    version: '/api'
  },
  accessLogout: {
    uri: '/auth/logout',
    method: 'DELETE',
    version: '/api'
  }
}

export default authEndpoints
