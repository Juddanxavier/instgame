const Game = require("../../models/game/Game.model");
const GameWon = require("../../models/game/GameWon.model");
const Bet = require("../../models/bet/Bet.model");
const moment = require("moment");

const getAllGame = async (req, res, next) => {
  try {
    const { query } = req;

    let gameFilter = {
      createdAt: {},
    };

    if (query?.from) {
      gameFilter.createdAt.$gte = moment(query?.from, "YYYY-MM-DD");
    }
    if (query?.to) {
      gameFilter.createdAt.$lt = moment(query?.to, "YYYY-MM-DD").add(1, "day");
    }
    const allGames = await Game.find(gameFilter).sort({ createdAt: -1 }).lean();

    let betFilter = {
      game: {
        $in: allGames?.map((game) => String(game?._id)),
      },
    };

    const allBets = await Bet.find(betFilter);
    const allGamesWon = await GameWon.find(betFilter);

    const games = Array.from(new Set(allBets?.map((bet) => String(bet?.game))));
    const gamesWon = Array.from(
      new Set(allGamesWon?.map((gameWon) => String(gameWon?.game)))
    );

    const filteredGames = allGames.filter((game) =>
      games.includes(String(game?._id))
    );
    // const allGamesId = new Set(allBets?.map((bet) => String(bet?.game)));

    const report = filteredGames.map((game) => {
      {
        const currentGameBets = allBets.filter(
          (bet) => String(bet?.game) === String(game?._id)
        );

        const currentGamesWonList = allGamesWon.filter(
          (gameWon) => String(gameWon?.game) === String(game?._id)
        );

        const allBetNumbers = new Set(
          currentGameBets.map((bet) => bet.betNumber)
        );

        const allBetList = currentGameBets.reduce(
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

        const pointsDistributed = currentGamesWonList.reduce(
          (prev, curr) => prev + curr.winningAmount,
          0
        );

        return { ...game, allBetListSet, grandTotal, pointsDistributed };
      }
    });

    res.send({
      type: "GetGames",
      status: "success",
      message: "Games fetched successfully",
      report,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = getAllGame;
