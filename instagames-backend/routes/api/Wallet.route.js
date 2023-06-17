const router = require("express").Router();

const validateAccessToken = require("../../middlewares/jwt_validation");
// bring in controllers
const depositRequest = require("../../controllers/request/depositRequest");
const depositRequestFromAdmin = require("../../controllers/request/depositRequestFromAdmin");
const withdrawRequest = require("../../controllers/request/withdrawRequest");
const getRequests = require("../../controllers/request/getRequests");
const getAllRequests = require("../../controllers/request/getAllRequests");
const getSingleRequest = require("../../controllers/request/getSingleRequest");
const updateRequest = require("../../controllers/request/updateRequest");
const revertRequest = require("../../controllers/request/revertRequest");
const getMyWallet = require("../../controllers/wallet/getMyWallet");
const getWallet = require("../../controllers/wallet/getWallet");
const updateWallet = require("../../controllers/wallet/updateWallet");
const updateWalletSettings = require("../../controllers/wallet/updateWalletSettings");
const createWalletSettings = require("../../controllers/wallet/createWalletSettings");
const getWalletSettings = require("../../controllers/wallet/getWalletSettings");

// login user
router.post("/depositRequest", validateAccessToken, depositRequest);
router.post(
  "/depositRequestFromAdmin",
  validateAccessToken,
  depositRequestFromAdmin
);
router.post("/withdrawRequest", validateAccessToken, withdrawRequest);
router.get("/requests", validateAccessToken, getRequests);
router.get("/allRequests", validateAccessToken, getAllRequests);
router.get("/request/:id", validateAccessToken, getSingleRequest);
router.put("/request/:id", validateAccessToken, updateRequest);
router.patch("/request/:id", validateAccessToken, revertRequest);
router.get("/walletSetting", getWalletSettings);
router.post("/walletSetting", createWalletSettings);
router.put("/walletSetting", validateAccessToken, updateWalletSettings);
router.get("/", validateAccessToken, getMyWallet);
router.get("/:id", validateAccessToken, getWallet);
router.post("/:id", validateAccessToken, updateWallet);

module.exports = router;
