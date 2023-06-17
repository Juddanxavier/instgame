import { useMutation } from 'react-query'

import TransactionService from '@/services/transaction/TransactionService'

const { createTransaction, updateTransaction, getTransactions } = new TransactionService()

export function useCreateTransaction() {
  return useMutation((body: any) => createTransaction(body))
}

export function useGetTransactions() {
  return useMutation((payload: any) => getTransactions(payload))
}

export function useUpdateTransaction() {
  return useMutation(({ transactionData, body }: any) => {
    return updateTransaction(transactionData, body)
  })
}
