const jwt = require("jsonwebtoken");
const createError = require("http-errors");

const { accessSecret, refreshSecret, accessTokenLife } =
  require("../config/keys").jwt;
const Token = require("../models/Token.model");

const { generateAccessToken } = require("../services/generate_token");

const validateAccessToken = async (req, res, next) => {
  const { refreshtoken, accesstoken } = req.headers;
  if (!accesstoken) {
    console.log("run");
    return next(createError.Unauthorized("Please login again"));
  }

  jwt.verify(accesstoken, accessSecret, async (err, decoded) => {
    if (err) {
      try {
        if (err.message === "jwt expired") {
          if (refreshtoken) {
            const payload = jwt.verify(refreshtoken, refreshSecret);
            if (!payload)
              throw createError.Unauthorized(
                "Session expired. Please login again."
              );

            const storedToken = await Token.findOne({
              user: payload._id,
              refreshToken: refreshtoken,
            }).populate("user");

            if (!storedToken)
              return next(createError.Unauthorized("Please login again"));

            const accessToken = generateAccessToken(
              { ...storedToken.user },
              accessTokenLife
            );

            if (accessToken) {
              const json_ = res.json; // capture the default resp.json implementation
              res.json = function (object) {
                json_.call(res, object);
              };

              req.user = storedToken.user;
              return next();
            }
          }
        }
        const message =
          err.name === "JsonWebTokenError" ? "Unauthorized" : err.message;
        return next(createError.Unauthorized(message));
      } catch (error) {
        console.log("error: ", error);
        return next(createError.InternalServerError());
      }
    }

    req.user = decoded;
    next();
  });
};

module.exports = validateAccessToken;
