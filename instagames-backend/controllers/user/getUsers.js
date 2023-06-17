const User = require("../../models/user/User.model");
const Bank = require("../../models/bank/Bank.model");
const Wallet = require("../../models/wallet/Wallet.model");
const Request = require("../../models/request/Request.model");
const Contact = require("../../models/Contact.model");

const getUsers = async (req, res, next) => {
  try {
    const {
      query,
      params: { id },
    } = req;

    const allUsers = await User.find({
      type: { $in: query.type },
      role: query.role,
      status: query.status,
      name: { $regex: query.keyword || "", $options: "i" },
    })
      .sort({ createdAt: -1 })
      .lean();

    const allUsersIdList = allUsers?.map((user) => user?._id);
    const userBanks = await Bank.find({ user: { $in: allUsersIdList } });

    const userContacts = await Contact.find({
      user: { $in: allUsersIdList },
    });

    const userWallets = await Wallet.find({
      user: { $in: allUsersIdList },
    }).lean();

    const pendingRequests = await Request.find({
      user: { $in: allUsersIdList },
      status: "requested",
      type: "withdraw",
    }).lean();

    const response = allUsers?.map((user) => {
      const userBank = userBanks
        .filter((bank) => String(bank?.user) === String(user?._id))
        .reduce((prev, curr) => curr, {});

      const userContact = userContacts
        .filter((contact) => String(contact?.user) === String(user?._id))
        .reduce((prev, curr) => curr, {});

      const userWithdrawRequests = pendingRequests
        ?.filter((request) => String(request?.user) === String(user?._id))
        .reduce((prev, curr) => curr.amount + prev, 0);

      const userWallet = userWallets
        ?.filter((wallet) => String(wallet?.user) === String(user?._id))
        .reduce((prev, curr) => curr, {});

      return {
        ...user,
        bank: userBank,
        wallet: {
          ...userWallet,
          balance: userWallet.balance - userWithdrawRequests,
        },
        contact: userContact,
      };
    });

    res.send({
      type: "GetUser: All",
      status: "success",
      message: "Fetched all users successfully",
      users: response,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = getUsers;
