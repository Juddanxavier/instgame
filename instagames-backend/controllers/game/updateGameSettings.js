const createError = require("http-errors");
const GameSetting = require("../../models/game/GameSetting.model");

const updateGameSettings = async (req, res, next) => {
  try {
    const { body } = req;
    if (!body) {
      throw createError.BadRequest(`Noting to update`);
    }
    console.log(body, "check");
    const gameSetting = await GameSetting.findOneAndUpdate({}, body);

    console.log(gameSetting);
    res.send({
      type: "UpdateGameSetting",
      status: "success",
      message: "Game setting updated successfully",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = updateGameSettings;
