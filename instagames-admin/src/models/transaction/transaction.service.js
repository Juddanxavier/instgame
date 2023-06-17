import httpStatus from 'http-status';

import ApiError from '@/utils/errors/ApiError';

import Transaction from './transaction.model';
import { TransactionStatus } from './transaction.model';
import { getStorageById, updateStorageById } from '../storage/storage.service';
import { getUserByIdWithStorage } from '../user/user.service';

/**
 * Create a transaction
 * @param {NewCreatedTransaction} transactionBody
 * @returns {Promise<ITransactionDoc>}
 */
export const createTransaction = async (transactionBody) => {
  const transactionStatus = await createTransactionStatus({
    status: 'initialized',
    step: 0,
    title: 'select add/withdraw',
  });
  const newTransaction = await Transaction.create({
    ...transactionBody,
    stage: [transactionStatus._id],
  });
  return newTransaction;
};

export const createTransactionStatus = async (transactionStatusBody) => {
  return TransactionStatus.create(transactionStatusBody).catch((err) => {
    console.log(err);
  });
};

/**
 * Get transaction by id
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<ITransactionDoc | null>}
 */
export const getTransactionById = async (id) => Transaction.findById(id);

/**
 * Get transaction by email
 * @param {string} phone
 * @returns {Promise<ITransactionDoc | null>}
 */
export const getTransactionByUserId = async (user) =>
  Transaction.find({ user });

/**
 * Update transaction by id
 * @param {mongoose.Types.ObjectId} transactionId
 * @param {UpdateTransactionBody} updateBody
 * @returns {Promise<ITransactionDoc | null>}
 */
export const updateTransactionById = async (transactionData, updateBody) => {
  let newPatch;
  switch (+transactionData?.step) {
    //create transaction
    case 0: {
      if (!transactionData?.id) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Transaction not found');
      }

      newPatch = Transaction.findById(transactionData?.id);
      break;
    }
    // add quantity
    case 1: {
      if (!updateBody?.quantity) {
        throw new ApiError(
          httpStatus.NOT_FOUND,
          'Please specify wheat quantity to proceed'
        );
      }
      const transactionStatus = await createTransactionStatus({
        status: 'inprogress',
        step: 1,
        title: 'add quantity',
      });

      newPatch = await Transaction.updateOne(
        { _id: transactionData?.id },
        {
          ...updateBody,
          $push: { stage: transactionStatus?._id },
        }
      );

      break;
    }
    // validate storage in case of withdrawal
    // else skip step 2
    case 2: {
      if (!updateBody?.storage) {
        throw new ApiError(
          httpStatus.NOT_FOUND,
          'Please select storage to proceed'
        );
      }

      newPatch = Transaction.updateOne(transactionData?.id, updateBody);

      break;
    }

    // select payment method and payment
    case 3: {
      if (!updateBody?.paymentMethod) {
        throw new ApiError(
          httpStatus.NOT_FOUND,
          'Please select a payment method'
        );
      }

      newPatch = Transaction.updateOne(transactionData?.id, updateBody);

      break;
    }
    // validate transaction
    case 4: {
      if (!updateBody?.paymentReceived) {
        throw new ApiError(
          httpStatus.NOT_FOUND,
          'Please check payment status and storage withdraw points'
        );
      }

      newPatch = Transaction.findById(transactionData?.id);

      break;
    }
    // complete transaction
    case 5: {
      if (!updateBody?.complete) {
        throw new ApiError(
          httpStatus.NOT_FOUND,
          'Please check if transaction complete ?'
        );
      }

      const transaction = await Transaction.findById(transactionData?.id);
      const storage = await getStorageById(transaction?.storage);

      if (!storage) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Storage not found');
      }
      if (transaction?.type === 'deposit') {
        updateStorageById(storage?._id, {
          quantity: (storage?.quantity + transaction.quantity).toFixed(3),
        });
      } else if (transaction?.type === 'withdraw') {
        updateStorageById(storage?._id, {
          quantity: (storage?.quantity - transaction.quantity).toFixed(3),
        });
      }

      newPatch = await getUserByIdWithStorage(storage?.user);

      break;
    }
  }

  return newPatch;
};

/**
 * Delete transaction by id
 * @param {mongoose.Types.ObjectId} transactionId
 * @returns {Promise<ITransactionDoc | null>}
 */
export const deleteTransactionById = async (transactionId) => {
  const transaction = await getTransactionById(transactionId);
  if (!transaction) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Transaction not found');
  }
  await transaction.remove();
  return transaction;
};
export function queryTransactions(keyword) {
  throw new Error('Function not implemented.');
}
