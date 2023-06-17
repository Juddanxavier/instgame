const Wallet = require("../../models/wallet/Wallet.model");
const WalletSetting = require("../../models/wallet/WalletSetting.model");
const Transaction = require("../../models/transaction/Transaction.model");
const Request = require("../../models/request/Request.model");
const createError = require("http-errors");

const updateWallet = async (req, res, next) => {
  try {
    const {
      params: { id },
      body: { amount, mode, requestId },
    } = req;

    const walletSetting = await WalletSetting.findOne();

    if (
      Number(amount) < 0 &&
      Math.abs(Number(amount)) < walletSetting.minimumWithdrawAmount
    ) {
      throw createError.BadRequest(
        `withdraw amount is less then ₹${walletSetting.minimumWithdrawAmount}`
      );
    }

    const wallet = await Wallet.findById(id).populate("user");

    const amountToUpdate = wallet.balance + Number(amount);

    if (
      Number(amount) < 0 &&
      amountToUpdate < walletSetting.minimumAccountBalance
    ) {
      throw createError.BadRequest(
        `Wallet needs to maintain minimum amount ₹${walletSetting.minimumAccountBalance}`
      );
    }

    wallet.balance = wallet.balance + Number(amount);
    wallet.save();

    const createTransaction = await Transaction.create({
      type: Number(amount) > 0 ? "deposit" : "withdraw",
      user: wallet.user._id,
      mode: Number(amount) > 0 ? "wallet" : mode,
      amount: Math.abs(amount),
      request: requestId,
    });

    const requestUpdate = await Request.findByIdAndUpdate(requestId, {
      status: "completed",
      $unset:{image:1},
    });

    res.send({
      type: "UpdateWallet : UpdateBalance, CreateTransaction",
      status: "success",
      message: "Balance updated successfully",
      wallet,
      transaction: createTransaction,
      request: requestUpdate,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = updateWallet;
