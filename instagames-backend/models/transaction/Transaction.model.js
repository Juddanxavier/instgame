const { Schema, model } = require("mongoose");

const transactionSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["deposit", "withdraw"],
      trim: true,
      required: true,
    },
    request: { type: Schema.Types.ObjectId, ref: "Request", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    mode: {
      type: String,
      enum: ["online", "upi", "cash", "wallet"],
      required: true,
    },
    amount: { type: Number },
  },
  {
    expireAfterSeconds: 3600,
    timestamps: true,
  }
);

const Transaction = model("Transaction", transactionSchema, "transaction");

// make this available to our users in our Node applications
module.exports = Transaction;
