const router = require("express").Router();

// bring in controllers

const updateUserBank = require("../../controllers/user/updateUserBank.js");
const updateBank = require("../../controllers/user/updateBank.js");
const updateContact = require("../../controllers/user/updateContact");
const updateUser = require("../../controllers/user/updateUser.js");
const getUsers = require("../../controllers/user/getUsers");
const updateUserData = require("../../controllers/user/updateUserData.js");
const deleteUser = require("../../controllers/user/deleteUser.js");
const getUser = require("../../controllers/user/getUser");
const myUserData = require("../../controllers/user/myUserData");
const validateAccessToken = require("../../middlewares/jwt_validation");

// update user
router.put("/bank/:id", updateUserBank);
router.get("/getUsers", validateAccessToken, getUsers);
router.post("/updateBank", validateAccessToken, updateBank);
router.post("/updateContact", validateAccessToken, updateContact);
router.post("/updateUser", validateAccessToken, updateUser);
router.get("/myUserData", validateAccessToken, myUserData);
router.put("/:id", validateAccessToken, updateUserData);
router.delete("/:id", validateAccessToken, deleteUser);
router.get("/:id", validateAccessToken, getUser);

module.exports = router;
