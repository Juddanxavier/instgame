const Game = require("../../models/game/Game.model");
const Bet = require("../../models/bet/Bet.model");
const { getStatus } = require("../../socket");
const createError = require("http-errors");

const getMyBets = async (req, res, next) => {
  const { user } = req;
  try {
    const { gameId, gameStatus } = getStatus();

    if (!gameStatus) {
      throw createError.BadRequest("Game has ended");
    }

    const allBets = await Bet.find({ user: user._id, game: gameId });

    res.send({
      type: "GetBet",
      status: "success",
      message: "Bet fetched successfully",
      allBets,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = getMyBets;
