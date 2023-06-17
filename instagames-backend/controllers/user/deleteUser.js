const User = require("../../models/user/User.model");
const Bank = require("../../models/bank/Bank.model");
const Wallet = require("../../models/wallet/Wallet.model");
const Contact = require("../../models/Contact.model");
const UserLogin = require("../../models/UserLogin.model");
const Permission = require("../../models/permission/Permission.model");
const Request = require("../../models/request/Request.model");
const Transaction = require("../../models/transaction/Transaction.model");
const Bet = require("../../models/bet/Bet.model");
const GameWon = require("../../models/game/GameWon.model");

const deleteUser = async (req, res, next) => {
  try {
    const {
      params: { id },
    } = req;
    const deletedUser = await User.findOneAndRemove({ _id: id });
    const deletedBank = await Bank.findOneAndRemove({ user: id });
    const deletedWallet = await Wallet.findOneAndRemove({ user: id });
    const deletedContact = await Contact.findOneAndRemove({ user: id });
    const deletedUserLogin = await UserLogin.findOneAndRemove({ user: id });
    const deletedPermision = await Permission.findOneAndRemove({ user: id });
    const deleteRequests = await Request.deleteMany({ user: id });
    const deleteTransactions = await Transaction.deleteMany({ user: id });
    const deleteBet = await Bet.deleteMany({ user: id });
    const deleteGameWon = await GameWon.deleteMany({ user: id });

    res.send({
      type: "DeleteUser: Single",
      status: "success",
      message: "Deleted user successfully",
      user: deletedUser,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = deleteUser;
