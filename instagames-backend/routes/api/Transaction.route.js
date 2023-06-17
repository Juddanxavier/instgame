const router = require("express").Router();

// bring in controllers

const geAllTransactions = require("../../controllers/transaction/geAllTransactions");
const geTransactions = require("../../controllers/transaction/geTransactions");
const validateAccessToken = require("../../middlewares/jwt_validation");

router.get("/all", validateAccessToken, geAllTransactions);
router.get("/", validateAccessToken, geTransactions);

module.exports = router;
