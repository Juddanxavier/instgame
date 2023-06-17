const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const crypto = require("crypto");
const moment = require("moment");

const { accessSecret, refreshSecret } = require("../config/keys").jwt;

const generateAccessToken = (payload, expiresIn) => {
  const accessTokenExpires = moment().add(expiresIn, "minutes");

  const options = {
    expiresIn: Number(accessTokenExpires.diff(moment(), "seconds")),
  };

  const token = jwt.sign(payload, accessSecret, options);
  if (!token) return createError.InternalServerError();
  return { name: "accessToken", value: token, ...options };
};

const generateRefreshToken = (payload, expiresIn) => {
  const refreshTokenExpires = moment().add(expiresIn, "days");

  const options = {
    expiresIn: Number(refreshTokenExpires.diff(moment(), "seconds")),
  };

  const token = jwt.sign(payload, refreshSecret, options);
  if (!token) return createError.InternalServerError();
  return { name: "refreshToken", value: token, ...options };
};

const generateCryptoKey = () => crypto.randomBytes(32).toString("hex");

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  generateCryptoKey,
};
