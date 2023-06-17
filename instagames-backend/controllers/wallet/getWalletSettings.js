const WalletSetting = require("../../models/wallet/WalletSetting.model");

const getWallet = async (req, res, next) => {
  try {
    const walletSetting = await WalletSetting.findOne();

    res.send({
      type: "WalletSetting",
      status: "success",
      message: "Wallet setting fetched successfully",
      walletSetting,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = getWallet;
