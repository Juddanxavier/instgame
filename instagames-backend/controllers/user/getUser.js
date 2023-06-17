const User = require("../../models/user/User.model");
const Bank = require("../../models/bank/Bank.model");
const Wallet = require("../../models/wallet/Wallet.model");
const Request = require("../../models/request/Request.model");
const Contact = require("../../models/Contact.model");
const Permission = require("../../models/permission/Permission.model");

const getUsers = async (req, res, next) => {
  try {
    let userPermissions;
    const {
      query,
      params: { id },
    } = req;

    const user = await User.findOne({
      _id: id,
    })
      .sort({ createdAt: -1 })
      .lean();

    const userBank = await Bank.findOne({ user: user?._id }).lean();

    const userContact = await Contact.findOne({
      user: user?._id,
    }).lean();

    const userWallet = await Wallet.findOne({
      user: user?._id,
    }).lean();

    if (user?.role === "staff") {
      userPermissions = await Permission.findOne({
        user: user?._id,
      });
    }

    const pendingRequests = await Request.findOne({
      user: user?._id,
      status: "requested",
      type: "withdraw",
    }).lean();

    const userWithdrawRequests = pendingRequests
      ?.filter((request) => String(request?.user) === String(user?._id))
      .reduce((prev, curr) => curr.amount + prev, 0);

    const response = {
      ...user,
      bank: userBank,
      wallet: {
        ...userWallet,
        balance: userWallet.balance - (userWithdrawRequests || 0),
      },
      contact: userContact,
      permissions: userPermissions?.permissions,
    };

    res.send({
      type: "GetUser: All",
      status: "success",
      message: "Fetched all users successfully",
      user: response,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = getUsers;
