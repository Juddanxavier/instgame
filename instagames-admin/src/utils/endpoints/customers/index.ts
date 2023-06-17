import { EndPoint } from '@/types/endpoints';

const userEndpoints: EndPoint = {
  getAllUsers: {
    uri: '/user/getUsers',
    method: 'GET',
    version: '/api',
  },
  getMyUser: {
    uri: '/user/myUserData',
    method: 'GET',
    version: '/api',
  },
  getUser: {
    uri: '/user/:id',
    method: 'GET',
    version: '/api',
  },
  deleteUser: {
    uri: '/user/:id',
    method: 'DELETE',
    version: '/api',
  },
  updateBank: {
    uri: '/user/updateBank',
    method: 'POST',
    version: '/api',
  },
  updateContact: {
    uri: '/user/:id',
    method: 'POST',
    version: '/api',
  },
  register: {
    uri: '/auth/register',
    method: 'POST',
    version: '/api',
  },
  updateUser: {
    uri: '/user/updateUser',
    method: 'POST',
    version: '/api',
  },
  updateUserData: {
    uri: '/user/:id',
    method: 'PUT',
    version: '/api',
  },
  verifyAuthToken: {
    uri: '/user/verifyAuthToken',
    method: 'POST',
    version: '/api',
  },
};

export default userEndpoints;
