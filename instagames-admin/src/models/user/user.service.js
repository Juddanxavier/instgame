import httpStatus from 'http-status';

import { getRoleInitials, matchRole, roles } from '@/utils/config/roles';
import ApiError from '@/utils/errors/ApiError';
import makeid from '@/utils/UIDs';

import User from './user.model';
import { generateAuthTokens } from '../token/token.service';

export const createUserId = async (userRole) => {
  let finalUID = '';
  const matchingRole = matchRole(userRole);
  const role = roles.includes(matchingRole.toLowerCase());
  if (!role) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `${userRole} type doesn't exist`
    );
  }

  const initials = getRoleInitials(matchingRole);

  while (!finalUID) {
    const tempId = initials + makeid(5);
    const user = await User.find({ userId: tempId });
    if (!user) {
      continue;
    }
    finalUID = tempId;
    break;
  }

  return finalUID;
};

/**
 * Create a user
 * @param {import('./user.interfaces').NewCreatedUser} userBody
 * @returns {Promise<import('./user.interfaces').NewRegisteredUser>}
 */
export const createUser = async (userBody) => {
  const user = await User.create(userBody);
  return user;
};

export const loginUser = async (userBody) => {
  const user = await getUserByEmail(userBody.key);
  const isMatch = await user.isPasswordMatch(userBody.password);
  if (!isMatch) {
    throw new ApiError(httpStatus.BAD_REQUEST, `authentication error`);
  }

  const tokens = await generateAuthTokens(user);

  return { ...user.toObject(), ...tokens };
};

/**
 * Register a user
 * @param {NewRegisteredUser} userBody
 * @returns {Promise<IUserDoc>}
 */
export const registerUser = async (userBody) => {
  if (await User.isPhoneTaken(userBody.phone)) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `${userBody.phone} already taken`
    );
  }
  return User.create(userBody);
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
export const queryUsers = async (keyword, preference) => {
  const preferenceList =
    !preference || preference === 'all'
      ? [
          { srno: Number(keyword) },
          { name: { $regex: new RegExp(keyword, 'i') } },
          { aadharNumber: { $regex: new RegExp(keyword, 'i') } },
          { phone: { $regex: new RegExp(keyword, 'i') } },
        ]
      : [
          preference === 'srno'
            ? { srno: Number(keyword) }
            : { [preference]: { $regex: new RegExp(keyword, 'i') } },
        ];

  const test = await User.aggregate([
    {
      $match: {
        $or: preferenceList,
      },
    },
    { $limit: 4 },
    {
      $lookup: {
        from: 'storages',
        let: {
          id: '$_id',
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $eq: ['$user', '$$id'],
                  },
                ],
              },
            },
          },
        ],
        as: 'storage',
      },
    },
    {
      $unwind: {
        path: '$storage',
        includeArrayIndex: 'string',
        preserveNullAndEmptyArrays: true,
      },
    },
    { $project: { password: 0 } },
  ]);

  return test;
};

/**
 * Get user by id
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<IUserDoc | null>}
 */
export const getUserById = async (id) => User.findById(id);

export const getUserByIdWithStorage = async (id) => {
  const test = await User.aggregate([
    {
      $match: {
        _id: id,
      },
    },
    {
      $lookup: {
        from: 'storages',
        let: {
          id: '$_id',
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $eq: ['$user', '$$id'],
                  },
                ],
              },
            },
          },
        ],
        as: 'storage',
      },
    },
    {
      $unwind: {
        path: '$storage',
        includeArrayIndex: 'string',
        preserveNullAndEmptyArrays: true,
      },
    },
    { $project: { password: 0 } },
  ]);

  return test.length ? test[0] : [];
};

/**
 * Get user by email
 * @param {string} phone
 * @returns {Promise<IUserDoc | null>}
 */
export const getUserByEmail = async (key) =>
  User.findOne({
    $or: [{ phone: RegExp(key, 'i') }, { uId: RegExp(key, 'i') }],
  });

/**
 * Update user by id
 * @param {mongoose.Types.ObjectId} userId
 * @param {UpdateUserBody} updateBody
 * @returns {Promise<IUserDoc | null>}
 */
export const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.phone && (await User.isPhoneTaken(updateBody.phone, userId))) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `${updateBody.phone} already taken`
    );
  }
  Object.assign(user, updateBody);
  await user.save().catch((error) => {
    console.log(error);
  });
  return user;
};

/**
 * Delete user by id
 * @param {mongoose.Types.ObjectId} userId
 * @returns {Promise<IUserDoc | null>}
 */
export const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.remove();
  return user;
};
