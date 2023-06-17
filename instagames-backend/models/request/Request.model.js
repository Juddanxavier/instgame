const { Schema, model } = require("mongoose");

const requestSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["deposit", "withdraw"],
      trim: true,
    },
    raisedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      default: "requested",
      enum: ["requested", "verifying", "completed", "rejected"],
    },
    amount: { type: Number },
    image: {
      thumbnailUrl: { type: String },
      url: { type: String },
    },
  },
  {
    expireAfterSeconds: 3600,
    timestamps: true,
  }
);

const Request = model("Request", requestSchema, "request");

// make this available to our users in our Node applications
module.exports = Request;

