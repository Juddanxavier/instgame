import { EndPoint } from '@/types/endpoints';

const requestEndpoints: EndPoint = {
  getSingleRequests: {
    uri: '/wallet/request/:id',
    method: 'GET',
    version: '/api',
  },
  depositRequest: {
    uri: '/wallet/depositRequestFromAdmin',
    method: 'POST',
    version: '/api',
  },
  updateRequest: {
    uri: '/wallet/request/:id',
    method: 'PUT',
    version: '/api',
  },
  revertRequest: {
    uri: '/wallet/request/:id',
    method: 'PATCH',
    version: '/api',
  },
  getAllRequests: {
    uri: '/wallet/allRequests',
    method: 'GET',
    version: '/api',
  },
};

export default requestEndpoints;
