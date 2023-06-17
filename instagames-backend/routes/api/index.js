const router = require("express").Router();

// import routes and middlewares
const authRoutes = require("./Auth.route");
const menuRoutes = require("./Menu.route");
const miscellaneousRoutes = require("./Miscellaneous.route");
const walletRoutes = require("./Wallet.route");
const userRoutes = require("./User.route");
const gameRoutes = require("./Game.route");
const transactionRoutes = require("./Transaction.route");
const validateAccessToken = require("../../middlewares/jwt_validation");

router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/game", gameRoutes);
router.use("/transaction", transactionRoutes);
router.use("/menu", menuRoutes);
router.use("/image", miscellaneousRoutes);
router.use("/wallet", walletRoutes);

// test route
router.get("/test", validateAccessToken, (req, res) => {
  res.status(200).json({
    message: "success",
  });
});

router.get("/ping", (req, res) => {
  res.json({ success: "true", message: "successful request" });
});

module.exports = router;
