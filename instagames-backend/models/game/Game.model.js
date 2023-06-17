const { Schema, model } = require("mongoose");

const gameSchema = new Schema(
  {
    gameId2: { type: String, required: true, unique: true },
    winningNumber: { type: Number },
    winningAmount: { type: Number },
  },
  {
    timestamps: true,
  }
);

const Game = model("Game", gameSchema, "game");

// make this available to our users in our Node applications
module.exports = Game;
