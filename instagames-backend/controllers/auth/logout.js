const jwt = require("jsonwebtoken");

const { refreshSecret } = require("../../config/keys").jwt;

const Token = require("../../models/Token.model");

const logoutUser = async (req, res, next) => {
  try {
    if (req?.headers?.accesstoken) {
      const { accesstoken } = req?.cookies;

      if (accesstoken) {
        const { data } = jwt.verify(accesstoken, refreshSecret);
        Token.findOneAndDelete({
          _userId: data._id,
          token: accesstoken,
        });
      }

      res.cookie("accesstoken", "deleted", {
        expires: new Date(Date.now() + 10000),
        httpOnly: true,
      });
      res.status(200).json({
        success: true,
        message: "User logged out successfully",
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = logoutUser;
