const User = require("../../models/user/User.model");
const Bank = require("../../models/bank/Bank.model");
const Contact = require("../../models/Contact.model");
const Permission = require("../../models/permission/Permission.model");

const getUsers = async (req, res, next) => {
  try {
    const { user } = req;

    const userData = await User.findOne({ _id: user?._id }).lean();

    const permissions = await Permission.findOne({
      user: user._id,
    }).lean();
    const myBank = await Bank.findOne({ user: user?._id }).lean();
    const myContact = await Contact.findOne({ user: user?._id }).lean();

    res.send({
      type: "GetUser: Self",
      status: "success",
      message: "Fetched my users successfully",
      userData: {
        user: { ...userData, permissions: permissions?.permissions },
        bank: myBank,
        contact: myContact,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = getUsers;
