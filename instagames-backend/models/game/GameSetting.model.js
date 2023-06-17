const { Schema, model } = require("mongoose");

const gameSettingSchema = new Schema(
  {
    deductionPercentage: { type: Number, default: 0 },
    deductionRatio: { type: Number, default: 0 },
    winningRatio: { type: Number, default: 0 },
    gameOffTime: { type: Number, default: 0 },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

const GameSetting = model("GameSetting", gameSettingSchema, "gameSetting");

// make this available to our games in our Node applications
module.exports = GameSetting;
