/* eslint-disable @typescript-eslint/no-this-alias */
import { model, models, Schema } from 'mongoose';

import paginate from '@/utils/paginate/paginate';
import toJSON from '@/utils/toJSON/toJSON';

const requestSchema = new Schema(
  {
    type: {
      type: String,
      enum: ['deposit', 'withdraw'],
      trim: true,
    },
    user: { type: String, required: true },
    status: {
      type: String,
      enum: ['requested', 'verifying', 'completed', 'rejected'],
    },
    images: [{ type: String, required: true }],
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
requestSchema.plugin(toJSON);
requestSchema.plugin(paginate);

const Request = models.Request || model('Request', requestSchema);

export default Request;
