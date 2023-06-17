const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const VerifyTokenSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "users",
  },
  token: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ["verify-phone", "forget-password"],
  },
  createdAt: {
    type: Date,
    expires: "7d",
    default: Date.now,
  },
});

const VerifyToken = mongoose.model(
  "verifyToken",
  VerifyTokenSchema,
  "verifytokens"
);

module.exports = VerifyToken;
