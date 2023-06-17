const { Schema, model } = require("mongoose");

const gameWonSchema = new Schema(
  {
    game: { type: Schema.Types.ObjectId, required: true, ref: "Game" },
    user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    winningAmount: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const GameWon = model("GameWon", gameWonSchema, "gameWon");

// make this available to our users in our Node applications
module.exports = GameWon;
