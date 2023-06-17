const { Schema, model } = require("mongoose");

const bankSchema = new Schema(
  {
    bankName: { type: String },
    accNo: { type: String },
    ifsc: { type: String },
    registeredName: { type: String },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
  }
);

const Bank = model("Bank", bankSchema, "bank");

// make this available to our banks in our Node applications
module.exports = Bank;
