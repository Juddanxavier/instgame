const { Schema, model } = require("mongoose");

const walletSchema = new Schema(
  {
    balance: { type: Number, default: 0 },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

const Wallet = model("Wallet", walletSchema, "wallet");

// make this available to our wallets in our Node applications
module.exports = Wallet;
