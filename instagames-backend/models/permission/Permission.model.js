const { Schema, model } = require("mongoose");

const permissionSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, required: true },
    permissions: [
      {
        title: { type: String },
        path: { type: String },
        access: { type: Boolean },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Permission = model("Permission", permissionSchema, "permission");

// make this available to our permissions in our Node applications
module.exports = Permission;
