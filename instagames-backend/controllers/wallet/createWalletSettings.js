const createError = require("http-errors");
const WalletSetting = require("../../models/wallet/WalletSetting.model");

const createWalletSettings = async (req, res, next) => {
  try {
    const { body } = req;

    if (!body) {
      throw createError.BadRequest(`Noting to update`);
    }

    const walletSetting = await WalletSetting.create(body);

    res.send({
      type: "CreateWalletSetting",
      status: "success",
      message: "Wallet setting created successfully",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = createWalletSettings;
