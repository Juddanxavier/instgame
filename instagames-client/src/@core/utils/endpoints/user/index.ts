import { EndPoint } from '@/types/endpoints'

const userEndpoints: EndPoint = {
  getAllUsers: {
    uri: '/user/getUsers',
    method: 'GET',
    version: '/api'
  },
  getMyUser: {
    uri: '/user/myUserData',
    method: 'GET',
    version: '/api'
  },
  createUser: {
    uri: '/user/createUser',
    method: 'POST',
    version: '/api'
  },
  updateUser: {
    uri: '/user/updateUser',
    method: 'POST',
    version: '/api'
  },
  updateBank: {
    uri: '/user/updateBank',
    method: 'POST',
    version: '/api'
  },
  updateContact: {
    uri: '/user/updateContact',
    method: 'POST',
    version: '/api'
  },
  verifyAuthToken: {
    uri: '/user/verifyAuthToken',
    method: 'POST',
    version: '/api'
  },
  updateUserBank: {
    uri: '/user/bank/:id',
    method: 'PUT',
    version: '/api'
  }
}

export default userEndpoints
