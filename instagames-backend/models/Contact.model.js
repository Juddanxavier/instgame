const { Schema, model } = require("mongoose");

const contactSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    contactType: {
      type: String,
      valueType: "String",
      trim: true,
    },
    contactValue: {
      type: String,
      lowercase: true,
      unique: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Contact = model("Contact", contactSchema, "contact");

// make this available to our users in our Node applications
module.exports = Contact;
