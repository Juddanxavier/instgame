const Wallet = require("../../models/wallet/Wallet.model");
const Request = require("../../models/request/Request.model");

const getWallet = async (req, res, next) => {
  try {
    const {
      params: { id },
    } = req;
    const wallet = await Wallet.findOne({ user: id }).populate("user").lean();
    const pendingRequests = await Request.find({
      user: id,
      status: "requested",
      type: "withdraw",
    }).lean();

    const requestedWithdrawAmount = pendingRequests.reduce(
      (prev, curr) => curr.amount + prev,
      0
    );

    const response = {
      ...wallet,
      balance: wallet.balance - requestedWithdrawAmount,
    };

    res.send({
      type: "Wallet",
      status: "success",
      message: "Wallet fetched successfully",
      wallet: response,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = getWallet;
