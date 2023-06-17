const bcrypt = require("bcryptjs");
const createError = require("http-errors");

// import models and helpers
const User = require("../../models/user/User.model");
const UserLogin = require("../../models/UserLogin.model");
const Token = require("../../models/Token.model");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../../services/generate_token");
const moment = require("moment");
const { serialize } = require("cookie");
const { accessTokenLife, refreshTokenLife } = require("../../config/keys").jwt;

const loginUser = async (req, res, next) => {
  const { apikey } = req.headers;
  try {
    const decoded = Buffer.from(apikey, "base64").toString().split(":");
    [this.phone, this.password, this.role] = decoded;

    const userLogin = await UserLogin.findOne({
      loginValue: this.phone,
    }).populate("user");

    if (!userLogin || (this.role && userLogin.user.role !== this.role)) {
      throw createError.BadRequest(
        "Please try again! email / password is not correct"
      );
    }

    const isMatch = await bcrypt.compare(this.password, userLogin.password);
    if (!isMatch) {
      throw createError.BadRequest(
        "Please try again! email / password is not correct"
      );
    }

    const accessToken = await generateAccessToken(
      userLogin.user.toObject(),
      accessTokenLife
    );
    const refreshToken = await generateRefreshToken(
      userLogin.user.toObject(),
      refreshTokenLife
    );

    if (accessToken && refreshToken) {
      const token = new Token({
        user: userLogin.user._id,
        refreshToken: refreshToken.value,
      });
      token.save();

      res.json({
        type: "UserLogin",
        status: "success",
        accessToken,
        refreshToken,
        message: "User logged in successfully",
        user: userLogin.user,
      });
    }
  } catch (error) {
    if (error.isJoi === true) error.status = 422;
    next(error);
  }
};

module.exports = loginUser;
