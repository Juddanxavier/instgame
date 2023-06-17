const { Schema, model } = require("mongoose");

const menuSchema = new Schema(
  {
    name: { type: String, required: true },
    parent: { type: Schema.Types.ObjectId },
  },
  {
    expireAfterSeconds: 3600,
    timestamps: true,
  }
);

const User = model("Menu", menuSchema, "menu");

// make this available to our users in our Node applications
module.exports = User;
