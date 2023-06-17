/* eslint-disable @typescript-eslint/no-this-alias */
import bcrypt from 'bcryptjs';
import { model, models, Schema } from 'mongoose';

import { roles } from '@/utils/config/roles';
import paginate from '@/utils/paginate/paginate';
import toJSON from '@/utils/toJSON/toJSON';

const userSchema = new Schema(
  {
    uId: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    address: {
      street: {
        type: String,
      },
      aptOrLocality: {
        type: String,
      },
      city: {
        type: String,
      },
      state: {
        type: String,
      },
      country: {
        type: String,
      },
    },
    bank: {
      accountNumber: {
        type: String,
      },
      nameInBank: {
        type: String,
      },
      ifsc: {
        type: String,
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      validate(value: string) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error(
            'Password must contain at least one letter and one number'
          );
        }
      },
      private: true, // used by the toJSON plugin
    },
    role: {
      type: String,
      enum: roles,
      default: 'customer',
    },
    // referenceUid: {
    //   type: String,
    //   required: true,
    // },
    // isEmailVerified: {
    //   type: Boolean,
    //   default: false,
    // },
    isPhoneVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);
userSchema.plugin(paginate);

/**
 * Check if email is taken
 * @param {string} phone - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
// userSchema.static('isPhoneTaken', async function (phone, excludeUserId) {
//   const user = await this.findOne({ phone, _id: { $ne: excludeUserId } });
//   return !!user;
// });

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.method('isPasswordMatch', async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
});

userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

const User = models.User || model('User', userSchema);

export default User;
