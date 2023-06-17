const { Server } = require("socket.io");
const Game = require("./models/game/Game.model");
const GameWon = require("./models/game/GameWon.model");
const Bet = require("./models/bet/Bet.model");
const Wallet = require("./models/wallet/Wallet.model");
const GameSetting = require("./models/game/GameSetting.model");
const { Types } = require("mongoose");
const JSONdb = require("simple-json-db");
const moment = require("moment-timezone");

const db = new JSONdb("./game.json");

if (!db.has("stdTTL")) {
  db.set("stdTTL", 10);
}
if (!db.has("gameStatus")) {
  db.set("gameStatus", false);
}
if (!db.has("gameId2")) {
  db.set("gameId2", "");
}
if (!db.has("offTime")) {
  db.set("offTime", null);
}
if (!db.has("gameId")) {
  db.set("gameId", "");
}
if (!db.has("recentWinner")) {
  db.set("recentWinner", null);
}
if (!db.has("timelimitInMinutes")) {
  db.set("timelimitInMinutes", 1);
}

// db.sync();

const getStatus = () => {
  let gameStatus = db.get("gameStatus");
  let gameId = db.get("gameId");
  let gameId2 = db.get("gameId2");
  return { gameStatus, gameId, gameId2 };
};

const whitelist = [
  "https://instagamesm.com/",
  "https://admin.instagamesm.com/",
  "http://localhost:3000/",
  "http://localhost:3001/",
];

const server = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: whitelist,
    },
  });

  io.on("connection", (socket) => {
    let gameStatus = db.get("gameStatus");
    let gameId = db.get("gameId");
    let gameId2 = db.get("gameId2");
    let recentWinner = db.get("recentWinner");
    let offTime = db.get("offTime");

    socket.emit("status", {
      gameStatus,
      gameId,
      gameId2,
      recentWinner,
      offTime,
    });

    socket.on("getStatus", () => {
      let gameStatus = db.get("gameStatus");
      let gameId = db.get("gameId");
      let gameId2 = db.get("gameId2");
      let recentWinner = db.get("recentWinner");
      let offTime = db.get("offTime");

      socket.emit("status", {
        gameStatus,
        gameId,
        gameId2,
        recentWinner,
        offTime,
      });
    });

    socket.on("gameOn", async () => {
      const newGenGameId = moment().tz("Asia/Dubai").format("YYYYMMDDHHMMSS");

      const newGame = await Game.create({
        gameId2: newGenGameId,
      }).catch((error) => {
        console.log(error);
      });

      db.set("gameStatus", true);
      db.set("gameId", newGame._id);
      db.set("gameId2", newGenGameId);
      db.sync();
      let gameStatus = db.get("gameStatus");
      let gameId = db.get("gameId");
      let gameId2 = db.get("gameId2");
      io.sockets.emit("gameOn", { gameStatus, gameId, gameId2 });
    });
    socket.on("gameOff", async () => {
      db.set("offTime", Date.now());
      db.sync();

      const gameSetting = await GameSetting.findOne({});
      io.sockets.emit("gameOffTime", db.get("offTime"));
      setTimeout(() => {
        db.set("gameStatus", false);
        db.set("offTime", null);
        db.sync();
        let gameStatus = db.get("gameStatus");

        io.sockets.emit("gameOff", { gameStatus });
      }, (gameSetting?.gameOffTime || db.get("timelimitInMinutes")) * 60000);
    });

    socket.on("result", async (number, amount, winningRatio) => {
      try {
        const game = await Game.findOne({ _id: db.get("gameId") });
        const bets = await Bet.find({ game: game._id, betNumber: number });
        const gameSetting = await GameSetting.findOne({});

        if (!winningRatio) {
          winningRatio = gameSetting?.winningRatio;
        }

        const winningAmount = Number(amount);
        const winningUsers = Array.from(
          new Set(bets.map((bet) => String(bet.user)))
        );

        winningUsers.map(async (user) => {
          const wallet = await Wallet.findOne({ user: Types.ObjectId(user) });

          const betWinningAmount =
            bets
              ?.filter((bet) => String(bet?.user) === String(user))
              .reduce((prev, curr) => {
                return prev + curr?.betAmount;
              }, 0) * winningRatio;

          const updatedWallet = await Wallet.findOneAndUpdate(
            { _id: wallet._id },
            { balance: wallet.balance + betWinningAmount }
          );

          const updatedGameWon = await GameWon.create({
            game: game?._id,
            user: Types.ObjectId(user),
            winningAmount: betWinningAmount,
          });
        });
        db.set("recentWinner", number);
        db.sync();

        const updatedGame = await Game.findOneAndUpdate(
          {
            _id: db.get("gameId"),
          },
          { winningNumber: db.get("recentWinner") }
        );

        io.sockets.emit("result", db.get("recentWinner"));

        db.set("gameId", "");
        db.set("gameId2", "");
        db.set("gameStatus", false);
        db.sync();
      } catch (error) {
        console.log(error);
      }
    });

    socket.on("disconnect", function () {
      console.log("Got disconnect!");
    });
  });

  return io;
};

module.exports = server;
module.exports.gameStatus = db.get("gameStatus");
module.exports.gameId = db.get("gameId");
module.exports.gameId2 = db.get("gameId2");
module.exports.getStatus = getStatus;
