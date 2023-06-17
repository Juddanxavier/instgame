const createError = require("http-errors");
var ObjectId = require("mongoose").Types.ObjectId;
String.prototype.toObjectId = function () {
  return new ObjectId(this.toString());
};

// import verify token model and user model
const User = require("../../models/user/User.model");
const ContactMech = require("../../models/Contact.model");
const VerifyTokenModel = require("../../models/VerifyToken.model");

const verifyEmail = async (req, res, next) => {
  try {
    const { otptoken } = req.headers;
    const otpdecoded = Buffer.from(otptoken, "base64").toString().split(":");
    [this.otp, this.otptoken, this.email] = otpdecoded;

    const notVerifiedContact = await ContactMech.findOne({
      contact_mech_type: "email",
      contact_mech_value: this.email,
    });

    const tokenDetails = await VerifyTokenModel.findOne({
      user: notVerifiedContact?.user,
      type: "verify-email",
    });

    if (tokenDetails?.otp !== this.otp) {
      throw createError.BadRequest("OTP didn't match");
    }

    const user = await User.findOne({ _id: tokenDetails.user });
    if (!user)
      throw createError.BadRequest(
        "We were unable to find a user for this verification. Please SignUp!"
      );
    if (user.isVerified) {
      throw createError.BadRequest(
        "User has been already verified. Please Login"
      );
    }

    user.isVerified = true;
    const updatedUser = await user.save();
    if (!updatedUser)
      throw createError.InternalServerError(
        "User could not be verified. Please try again."
      );
    await VerifyTokenModel.findOneAndDelete({
      user: tokenDetails?.user,
      token: tokenDetails?.token,
      type: "verify-email",
    });
    res.status(200).json({
      success: true,
      message: "Your account has been successfully verified",
    });
  } catch (error) {
    console.log("error: ", error);
    next(error);
  }
};

module.exports = verifyEmail;
