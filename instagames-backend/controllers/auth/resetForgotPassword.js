const bcrypt = require("bcryptjs");
const createError = require("http-errors");

const UserLoginMech = require("../../models/UserLogin.model");
const Token = require("../../models/Token.model");

const User = require("../../models/user/User.model");
const ContactMech = require("../../models/Contact.model");
const VerifyTokenModel = require("../../models/VerifyToken.model");

const resetPassword = async (req, res, next) => {
  try {
    // const userId = req.user._id;
    const { payload } = req.headers;

    const decoded = Buffer.from(payload, "base64").toString().split(":");
    [this.email, this.password, this.verificationToken, this.otp] = decoded;

    const userContact = await ContactMech.findOne({
      contact_mech_type: "email",
      contact_mech_value: this.email,
    });

    const tokenDetails = await VerifyTokenModel.findOne({
      user: userContact?.user,
      type: "forget-password",
    });

    if (!tokenDetails) {
      throw createError.BadRequest("Token expired");
    }

    //verify otp
    if (tokenDetails?.otp !== this.otp) {
      throw createError.BadRequest("OTP didn't match");
    }

    const user = await User.findOne({ _id: tokenDetails.user });
    if (!user)
      throw createError.BadRequest(
        "We were unable to find a user for this verification. Please SignUp!"
      );

    // compare token
    const isMatch = await bcrypt.compare(
      this.verificationToken,
      tokenDetails.token
    );
    if (!isMatch) throw createError.BadRequest("User didn't match");
    // this runs when the request is legit
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    if (!hashedPassword) {
      throw createError.BadRequest(
        "Your request could not be processed. Please try again after some time."
      );
    }
    const loginMerch = await UserLoginMech.updateMany(
      { user: tokenDetails.user },
      { password: hashedPassword }
    );
    if (!loginMerch)
      throw createError.BadRequest(
        "Your request could not be processed. Please try again after some time."
      );

    // remove all refresh tokens
    const deleted = await Token.deleteMany({ _userId: user._id });
    if (!deleted) throw createError.InternalServerError();

    // await VerifyTokenModel.deleteMany({
    //   user: userContact?.user,
    //   type: "forget-password",
    // });

    // send password change confirmation email to user
    // const message = {
    //   subject: "Password Successfully changed",
    //   body: emailTemplate(createdUser, "", "confirmPassword"),
    // };

    // await sendEmail(
    //     [email],
    //     "Verify your FansTime account",
    //     verifyEmailTemplate(
    //       { name: user?.name },
    //       `http://localhost:3000/forgotpassword?token=${requestPasswordToken}&user=${user?._id}`
    //     )
    //   );

    res.status(200).json({
      success: true,
      message: "Password Successfully changed",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = resetPassword;
