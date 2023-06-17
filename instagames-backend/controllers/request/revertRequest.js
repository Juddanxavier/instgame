const Request = require("../../models/request/Request.model");
const Transaction = require("../../models/transaction/Transaction.model");
const Wallet = require("../../models/wallet/Wallet.model");

const revertRequest = async (req, res, next) => {
  try {
    const {
      params: { id },
      body,
    } = req;
    let previousAmount = 0;

    console.log(id);
    const request = await Request.findById(id);

    const transaction = await Transaction.findOne({ request: id });

    const wallet = await Wallet.findOne({ user: request?.user });

    if (request?.type === "deposit") {
      previousAmount = Number(wallet?.balance) - transaction?.amount;
    } else {
      previousAmount = Number(wallet?.balance) + transaction?.amount;
    }

    const updatedWallet = await Wallet.findByIdAndUpdate(wallet?._id, {
      balance: previousAmount,
    });

    const updatedRequest = await Request?.findByIdAndUpdate(request?._id, {
      status: "verifying",
    });

    const deletedTransaction = await Transaction?.remove({
      _id: transaction?._id,
    });

    res.send({
      type: "RevertRequest: Revert",
      status: "success",
      message: "Request updated successfully",
      request,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = revertRequest;
