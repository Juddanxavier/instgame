const { Schema, model } = require("mongoose");

const betSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    game: { type: Schema.Types.ObjectId, ref: "Game" },
    betNumber: { type: Number, required: true },
    betAmount: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const Bet = model("Bet", betSchema, "bet");

// make this available to our users in our Node applications
module.exports = Bet;
