const createError = require("http-errors");
const WalletSetting = require("../../models/wallet/WalletSetting.model");

const updateWalletSettings = async (req, res, next) => {
  try {
    const { body } = req;

    if (!body) {
      throw createError.BadRequest(`Noting to update`);
    }

    const walletSetting = await WalletSetting.findOneAndUpdate({}, body);

    res.send({
      type: "UpdateWalletSetting",
      status: "success",
      message: "Wallet setting updated successfully",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = updateWalletSettings;
