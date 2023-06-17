const Game = require("../../models/game/Game.model");
const Bet = require("../../models/bet/Bet.model");
const Wallet = require("../../models/wallet/Wallet.model");
const WalletSetting = require("../../models/wallet/WalletSetting.model");

const { getStatus } = require("../../socket");
const createError = require("http-errors");

const getMenu = async (req, res, next) => {
  const { body, user } = req;
  try {
    const { gameId, gameStatus } = getStatus();

    const walletSettings = await WalletSetting.findOne({});
    if (!gameStatus) {
      throw createError.BadRequest("Game has ended");
    }
    const wallet = await Wallet.findOne({ user: user._id });

    if (wallet.balance - Number(body.betAmount) < 0) {
      throw createError.BadRequest("Insufficient Balance");
    }

    const newBet = await Bet.create({ user: user._id, game: gameId, ...body });

    const updatedwWallet = await Wallet.findOneAndUpdate(
      { _id: wallet._id },
      {
        balance: wallet.balance - Number(body.betAmount),
      }
    );

    res.send({
      type: "CreateBet",
      status: "success",
      message: "Bet placed successfully",
      newBet,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = getMenu;
