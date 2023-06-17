import { useMutation } from 'react-query';

import TransactionService from '@/services/transaction/TransactionService';

const { createTransaction, updateTransaction, getAllTransactions } =
  new TransactionService();

export function useCreateTransaction() {
  return useMutation((body: any) => createTransaction(body));
}

export function useGetAllTransactions() {
  return useMutation((payload: any) => getAllTransactions(payload));
}

export function useUpdateTransaction() {
  return useMutation(({ transactionData, body }: any) => {
    return updateTransaction(transactionData, body);
  });
}
