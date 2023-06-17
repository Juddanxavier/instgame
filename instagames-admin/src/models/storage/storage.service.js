import httpStatus from 'http-status';

import ApiError from '@/utils/errors/ApiError';

import Storage from './storage.model';

/**
 * Create a storage
 * @param {NewCreatedStorage} storageBody
 * @returns {Promise<IStorageDoc>}
 */
export const createStorage = async (storageBody) => {
  return Storage.create(storageBody);
};

/**
 * Query for storages
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
export const queryStorages = async (filter, options) => {
  const storages = await Storage.paginate(filter, options);
  return storages;
};

/**
 * Get storage by id
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<IStorageDoc | null>}
 */
export const getStorageById = async (id) => Storage.findById(id);

/**
 * Get storage by email
 * @param {string} phone
 * @returns {Promise<IStorageDoc | null>}
 */
export const getStorageByUserId = async (user) => Storage.find({ user });

/**
 * Update storage by id
 * @param {mongoose.Types.ObjectId} storageId
 * @param {UpdateStorageBody} updateBody
 * @returns {Promise<IStorageDoc | null>}
 */
export const updateStorageById = async (storageId, updateBody) => {
  const storage = await getStorageById(storageId);
  if (!storage) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Storage not found');
  }
  Object.assign(storage, updateBody);
  await storage.save();
  return storage;
};

/**
 * Delete storage by id
 * @param {mongoose.Types.ObjectId} storageId
 * @returns {Promise<IStorageDoc | null>}
 */
export const deleteStorageById = async (storageId) => {
  const storage = await getStorageById(storageId);
  if (!storage) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Storage not found');
  }
  await storage.remove();
  return storage;
};
export function createTransaction(arg0) {
  throw new Error('Function not implemented.');
}
