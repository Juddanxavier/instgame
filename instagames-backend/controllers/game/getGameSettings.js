const GameSetting = require("../../models/game/GameSetting.model");

const getGame = async (req, res, next) => {
  try {
    const gameSetting = await GameSetting.findOne();

    res.send({
      type: "GameSetting",
      status: "success",
      message: "Game setting fetched successfully",
      gameSetting,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = getGame;
