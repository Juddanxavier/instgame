import httpStatus from 'http-status';

import ApiError from '@/utils/errors/ApiError';

import Request from './request.model';

/**
 * Create a request
 * @param {import('./request.interfaces').NewCreatedRequest} requestBody
 * @returns {Promise<import('./request.interfaces').NewRegisteredRequest>}
 */
export const createRequest = async (requestBody) => {
  const request = await Request.create(requestBody);
  return request;
};

/**
 * Get request by email
 * @param {string} phone
 * @returns {Promise<IRequestDoc | null>}
 */
export const getRequestByKey = async (key) =>
  Request.findOne({
    $or: [{ [key]: RegExp(key, 'i') }],
  });

/**
 * Update request by id
 * @param {mongoose.Types.ObjectId} requestId
 * @param {UpdateRequestBody} updateBody
 * @returns {Promise<IRequestDoc | null>}
 */
export const updateRequestById = async (id, updateBody) => {
  const request = await getRequestByKey(id);
  if (!request) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Request not found');
  }
  Object.assign(request, updateBody);
  await request.save().catch((error) => {
    console.log(error);
  });
  return request;
};

/**
 * Delete request by id
 * @param {mongoose.Types.ObjectId} requestId
 * @returns {Promise<IRequestDoc | null>}
 */
export const deleteRequestById = async (id) => {
  const request = await getRequestByKey(id);
  if (!request) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Request not found');
  }
  await request.remove();
  return request;
};
