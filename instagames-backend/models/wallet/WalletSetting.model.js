const { Schema, model } = require("mongoose");

const walletSettingSchema = new Schema(
  {
    minimumAccountBalance: { type: Number, default: 0 },
    userDefaultBalance: { type: Number, default: 0 },
    minimumWithdrawAmount: { type: Number, default: 0 },
    maximumWithdrawAmount: { type: Number, default: 0 },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

const Wallet = model("WalletSetting", walletSettingSchema, "walletSetting");

// make this available to our wallets in our Node applications
module.exports = Wallet;
