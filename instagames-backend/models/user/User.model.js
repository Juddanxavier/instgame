const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    primaryPhone: { type: Schema.Types.ObjectId, ref: "Contact" },
    type: {
      type: String,
      default: "customer",
      enum: ["admin", "superadmin", "customer"],
    },
    isVerified: { type: Boolean, required: true, default: false },
    role: { type: String, default: "user", enum: ["user", "staff"] },
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema, "user");

// make this available to our users in our Node applications
module.exports = User;
