import { model, models, Schema } from 'mongoose';

import toJSON from '@/utils/toJSON/toJSON';

import { IStorageDoc, IStorageModel } from './storage.interfaces';

const storageSchema = new Schema<IStorageDoc, IStorageModel>(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      trim: true,
    },
    quantity: {
      type: Number,
      default: 0,
    },
    product: {
      type: String,
      enum: ['wheat'],
      default: 'wheat',
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
storageSchema.plugin(toJSON);
// storageSchema.plugin(paginate);

const Storage =
  models.Storage || model<IStorageDoc, IStorageModel>('Storage', storageSchema);

export default Storage;
