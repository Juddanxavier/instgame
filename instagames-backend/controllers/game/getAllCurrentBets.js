const Game = require("../../models/game/Game.model");
const Bet = require("../../models/bet/Bet.model");
const { getStatus } = require("../../socket");
const createError = require("http-errors");

const getAllCurrentBets = async (req, res, next) => {
  const { user } = req;
  try {
    const { gameId, gameStatus } = getStatus();

    const allBets = await Bet.find({ game: gameId });

    const allBetNumbers = new Set(allBets.map((bet) => bet.betNumber));

    const allBetList = allBets.reduce(
      (prev, bet) => [
        ...prev,
        { number: bet.betNumber, amount: bet.betAmount },
      ],
      []
    );

    const allBetListSet = Array.from(allBetNumbers).map((number) => ({
      number,
      totalBet: allBetList
        .filter((bet) => bet.number === number)
        .reduce((prev, curr) => prev + curr.amount, 0),
    }));

    const grandTotal = allBetListSet.reduce(
      (prev, curr) => prev + curr.totalBet,
      0
    );
    res.send({
      type: "getAllCurrentBets",
      status: "success",
      message: "Bet fetched successfully",
      allBetListSet,
      grandTotal,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = getAllCurrentBets;
