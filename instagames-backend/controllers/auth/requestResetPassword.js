const bcrypt = require("bcryptjs");
const createError = require("http-errors");

const { generateCryptoKey } = require("../../services/generate_token");

const sendEmail = require("../../services/sendEmail");
const generateOtp = require("../../services/generateOtp");
const verifyEmailTemplate = require("../../config/emailTemplates/verifyEmail");

// import models
const User = require("../../models/user/User.model");
const ContactMech = require("../../models/Contact.model");
const VerifyToken = require("../../models/VerifyToken.model");
const { emailValidation } = require("../../services/validation_schema");

const requestResetPassword = async (req, res, next) => {
  try {
    // validate input email
    const { email } = await emailValidation.validateAsync(req.body);
    const primary_email = await ContactMech.findOne({
      contact_mech_value: email,
      contact_mech_type: "email",
    });

    // find email in db
    const user = await User.findOne({ primary_email });
    if (!user)
      throw createError.BadRequest(
        "This email is not associated to any account. Please register."
      );

    if (user.primary_email) {
      // generate request reset password token and save to db

      await VerifyToken.deleteMany({
        user: user._id,
        type: "forget-password",
      });
      const otp = generateOtp();
      const verificationToken = generateCryptoKey();
      const hashedToken = await bcrypt.hash(verificationToken, 10);
      const verification = new VerifyToken({
        user: user._id,
        otp,
        token: hashedToken,
        type: "forget-password",
      });

      await verification.save();

      await sendEmail(
        [email],
        "Verify your Property Yards account",
        verifyEmailTemplate({ name: user.name }, otp)
      );

      res.status(200).json({
        success: true,
        otp,
        verificationToken,
        message: "Email sent to reset password",
      });
    }
  } catch (err) {
    if (err.isJoi === true) err.status = 422;
    next(err);
  }
};

module.exports = requestResetPassword;
