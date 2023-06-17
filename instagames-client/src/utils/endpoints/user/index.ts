import { EndPoint } from '@/types/endpoints'

const userEndpoints: EndPoint = {
  getAllUsers: {
    uri: '/user/getUsers',
    method: 'POST',
    version: '/api'
  },
  createUser: {
    uri: '/auth/register',
    method: 'POST',
    version: '/api'
  },
  updateUserBank: {
    uri: '/user/bank/:id',
    method: 'PUT',
    version: '/api'
  },
  verifyAuthToken: {
    uri: '/user/verifyAuthToken',
    method: 'POST',
    version: '/api'
  }
}

export default userEndpoints
