const User = require("../../models/user/User.model");
const Bank = require("../../models/bank/Bank.model");
const Contact = require("../../models/Contact.model");
const UserLogin = require("../../models/UserLogin.model");
const Permission = require("../../models/permission/Permission.model");
const genPassword = require("../../services/genPassword");

const updateUser = async (req, res, next) => {
  try {
    const {
      params: { id },
      body,
    } = req;
    let user, bank, contact;
    if (body.user) {
      user = await User.findOneAndUpdate({ _id: id }, body.user);
    }
    if (body.bank) {
      bank = await Bank.findOneAndUpdate({ user: id }, body.bank);
    }
    if (body.contact) {
      contact = await Contact.findOneAndUpdate({ user: id }, body.contact);
    }

    if (body?.password) {
      const password = await genPassword(body?.password);
      const updatedUserLogin = await UserLogin.findOneAndUpdate(
        { user: id },
        { password }
      );
    }

    const permission = await Permission.findOne({ user: id });

    if (!permission) {
      const newPermission = await Permission.create({
        user: id,
        permissions: body.permissions,
      });
    } else {
      if (Object.keys(body).includes("permissions")) {
        const updatedPermissions = await Permission.findOneAndUpdate(
          { user: id },
          { permissions: body.permissions }
        );
      }
    }
    res.send({
      type: "UpdateUser: Single",
      status: "success",
      message: "Updated user successfully",
      user,
      bank,
      contact,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = updateUser;
