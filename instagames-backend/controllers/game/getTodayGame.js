const Game = require("../../models/game/Game.model");
const { getStatus } = require("../../socket");
const createError = require("http-errors");
const moment = require("moment");

const today = moment().startOf("day");

const getMyBets = async (req, res, next) => {
  try {
    const todayGames = await Game.find({
      createdAt: {
        $gte: today.toDate(),
        $lte: moment(today).endOf("day").toDate(),
      },
    }).sort({ createdAt: -1 });

    res.send({
      type: "GetGames",
      status: "success",
      message: "Games fetched successfully",
      todayGames,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = getMyBets;
