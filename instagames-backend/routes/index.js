const router = require("express").Router();
const createError = require("http-errors");

const apiRoutes = require("./api");

router.use("/api", apiRoutes);

router.use("/api", (req, res, next) => {
  next(
    createError.NotFound("The route you are trying to access does not exist.")
  );
});

router.use((error, req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.status(error.status || 500);
  return res.json({
    error: {
      status: error.status || 500,
      message: error.message || "Internal Server Error",
    },
  });
});

module.exports = router;
