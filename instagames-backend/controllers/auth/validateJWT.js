const jwt = require("jsonwebtoken");
const createError = require("http-errors");

const { accessSecret, refreshSecret, accessTokenLife } =
  require("../../config/keys").jwt;
const Token = require("../../models/Token.model");
const Permission = require("../../models/permission/Permission.model");

const { generateAccessToken } = require("../../services/generate_token");

const validateAccessToken = async (req, res, next) => {
  const { refreshToken, accessToken } = req.cookies;

  if (!refreshToken) {
    return next(createError.Unauthorized("Please login again"));
  }

  if (accessToken) {
    jwt.verify(accessToken, accessSecret, async (err, decoded) => {
      if (err) {
        throw createError.Unauthorized("Session expired. Please login again.");
      }
      let userPermissions;

      if (decoded.role === "staff") {
        userPermissions = await Permission.find({ user: decoded?._id });
      }

      res.json({
        type: "UserVerify",
        status: "success",
        auth: true,
        message: "User verified successfully",
        user: { ...decoded, permissions: userPermissions?.permissions },
      });
    });
  } else if (refreshToken) {
    try {
      const payload = jwt.verify(refreshToken, refreshSecret);

      if (!payload)
        throw createError.Unauthorized("Session expired. Please login again.");

      const storedToken = await Token.findOne({
        user: payload._id,
        refreshToken: refreshToken,
      }).populate("user");

      if (!storedToken)
        return next(createError.Unauthorized("Please login again"));

      const accessToken = generateAccessToken(
        { ...storedToken.user },
        accessTokenLife
      );
      let userPermissions;

      if (payload.role === "staff") {
        userPermissions = await Permission.find({ user: payload?._id });
      }

      if (accessToken) {
        res.json({
          type: "UserLogin",
          status: "success",
          accessToken,
          message: "User logged in successfully",
          user: { ...payload, permissions: userPermissions?.permissions },
        });
      } else {
        res.json({
          type: "UserLogin",
          status: "unsuccessful",
          message: "User login unsuccessful",
        });
      }
    } catch (error) {
      console.log("error: ", error);
      return next(createError.InternalServerError());
    }
  }
};

module.exports = validateAccessToken;
