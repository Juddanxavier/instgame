const router = require("express").Router();

// bring in controllers
const upload = require("../../controllers/miscellaneous/upload");
const allowOrigin = require("../../middlewares/allowOrigin");

// login user
router.post("/uploadImage", upload);

module.exports = router;
