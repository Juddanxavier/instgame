const createError = require("http-errors");
const GameSetting = require("../../models/game/GameSetting.model");

const createGameSettings = async (req, res, next) => {
  try {
    const { body } = req;

    if (!body) {
      throw createError.BadRequest(`Noting to update`);
    }

    const gameSetting = await GameSetting.create(body);

    res.send({
      type: "CreateGameSetting",
      status: "success",
      message: "Game setting created successfully",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = createGameSettings;
