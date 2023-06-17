const router = require("express").Router();

const placeBet = require("../../controllers/game/placeBet");
const getMyBets = require("../../controllers/game/getMyBets");
const getAllCurrentBets = require("../../controllers/game/getAllCurrentBets");
const getAllGame = require("../../controllers/game/getAllGame");
const getMyGame = require("../../controllers/game/getMyGame");
const getTodayGame = require("../../controllers/game/getTodayGame");
const validateAccessToken = require("../../middlewares/jwt_validation");
const updateGameSettings = require("../../controllers/game/updateGameSettings");
const createGameSettings = require("../../controllers/game/createGameSettings");
const getGameSettings = require("../../controllers/game/getGameSettings");

router.post("/bet", validateAccessToken, placeBet);
router.get("/bet", validateAccessToken, getMyBets);
router.get("/allBets", validateAccessToken, getAllCurrentBets);
router.get("/report", validateAccessToken, getAllGame);
router.get("/myReport", validateAccessToken, getMyGame);
router.get("/todayGames", validateAccessToken, getTodayGame);
router.get("/gameSetting", validateAccessToken, getGameSettings);
router.post("/gameSetting", validateAccessToken, createGameSettings);
router.put("/gameSetting", validateAccessToken, updateGameSettings);

module.exports = router;
