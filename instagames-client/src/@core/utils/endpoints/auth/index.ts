import { EndPoint } from '@/types/endpoints';

const authEndpoints: EndPoint = {
  accessSignin: {
    uri: '/user/loginUser',
    method: 'POST',
    version: '/api',
  },
  register: {
    uri: '/auth/register',
    method: 'POST',
    version: '/api',
  },
  accessLogout: {
    uri: '/auth/logout',
    method: 'DELETE',
    version: '/api',
  },
  verify: {
    uri: '/user/verifyAuthToken',
    method: 'POST',
    version: '/api',
  },
};

export default authEndpoints;
