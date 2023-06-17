const { Schema, model } = require("mongoose");

const UserLoginSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    role: { type: String, enum: ["admin", "customer"], default: "customer" },
    loginType: {
      type: String,
      valueType: "String",
      trim: true,
    },
    loginValue: {
      type: String,
      lowercase: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const UserLoginMech = model("UserLogin", UserLoginSchema, "userlogin");

// make this available to our users in our Node applications
module.exports = UserLoginMech;
