const router = require("express").Router();

const getMenu = require("../../controllers/menu/getMenu");

router.get("/", getMenu);
router.post("/", getMenu);

module.exports = router;
