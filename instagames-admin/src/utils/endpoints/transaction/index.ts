import { EndPoint } from '@/types/endpoints';

const transactionEndpoints: EndPoint = {
  createTransaction: {
    uri: '/transaction/createTransaction',
    method: 'POST',
    version: '/api',
  },
  getAllTransactions: {
    uri: '/transaction/all',
    method: 'GET',
    version: '/api',
  },

  updateTransaction: {
    uri: '/transaction/updateTransaction/:id/:step',
    method: 'POST',
    version: '/api',
  },
};

export default transactionEndpoints;
