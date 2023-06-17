import { EndPoint } from '@/types/endpoints';

const menuEndpoints: EndPoint = {
  getMenu: {
    uri: '/menu',
    method: 'GET',
    version: '/api',
  },
};

export default menuEndpoints;
