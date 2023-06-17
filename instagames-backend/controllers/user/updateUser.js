const User = require("../../models/user/User.model");
const UserLogin = require("../../models/UserLogin.model");
const genPassword = require("../../services/genPassword");

const updateUser = async (req, res, next) => {
  try {
    const { user: _id, body } = req;
    const updatedUser = await User.findOneAndUpdate({ _id }, body);

    if (body?.password) {
      const password = await genPassword(body?.password);
      const updatedUserLogin = await UserLogin.findOneAndUpdate(
        { user: _id },
        { password }
      );
    }

    res.send({
      type: "UpdateUser: Self",
      status: "success",
      message: "Updated user successfully",
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = updateUser;
