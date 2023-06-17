const bcrypt = require("bcryptjs");
const createError = require("http-errors");

// import models and helpers
const User = require("../../models/user/User.model");
const Wallet = require("../../models/wallet/Wallet.model");
const ContactMech = require("../../models/Contact.model");
const UserLoginMech = require("../../models/UserLogin.model");
const VerifyTokenModel = require("../../models/VerifyToken.model");
const Bank = require("../../models/bank/Bank.model");
const Permission = require("../../models/permission/Permission.model");
const WalletSetting = require("../../models/wallet/WalletSetting.model");

const { generateCryptoKey } = require("../../services/generate_token");
// const { registerValidation } = require("../../services/validation_schema");
const generateOtp = require("../../services/generateOtp");

const registerUser = async (req, res, next) => {
  const {
    headers: { payload },
    body,
  } = req;

  const decoded = Buffer.from(payload, "base64").toString().split(":");
  [this.name, this.phone, this.password, this.type, this.role] = decoded;

  try {
    const walletSetting = await WalletSetting.findOne();

    // validation code here
    if (!this.phone) {
      throw createError.BadRequest(
        "Email or phone number is required for registration."
      );
    }

    // const result = await registerValidation.validateAsync(this);

    // eslint-disable-next-line no-unused-vars
    const { phone, password, name, type, role } = this;

    // check for already registration of phone
    if (phone) {
      const existingPhone = await ContactMech.findOne({
        contactType: "phone",
        contactValue: phone,
      });
      if (existingPhone) {
        throw createError.Conflict(
          `${phone} is already registered. Please login.`
        );
      }
    }

    const user = new User({
      name,
    });

    if (role === "staff") {
      if (!role) {
        throw createError.Conflict(`Please provide a role.`);
      }

      user.type = type;
      user.role = role;
    }
    // Save user to DB

    const createdUser = await user.save();
    if (!createdUser)
      throw createError.InternalServerError(
        "Your request could not be processed. Please contact support or try again after some time."
      );

    if (phone) {
      const phoneContactMech = new ContactMech({
        user: createdUser._id,
        contactType: "phone",
        contactValue: phone,
      });

      const savedEmailContactMech = await phoneContactMech.save();
      createdUser.primary_phone = savedEmailContactMech._id;
    }

    createdUser.save();

    // this runs when the user is new
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    if (phone) {
      const userPhoneLoginMech = new UserLoginMech({
        user: createdUser._id,
        loginType: "phone",
        loginValue: phone,
        password: hashedPassword,
      });
      userPhoneLoginMech.save();
    }

    // generate verify phone token and save to db
    if (phone) {
      const otp = generateOtp();
      const verificationToken = generateCryptoKey();
      const hashedToken = await bcrypt.hash(verificationToken, 10);
      const verification = new VerifyTokenModel({
        user: createdUser._id,
        token: hashedToken,
        otp,
        type: "verify-phone",
      });

      await verification.save();

      // send verification email to saved user
      // await sendEmail(
      //   [email],
      //   "Verify your Property Yards account",
      //   verifyEmailTemplate({ name: createdUser.name }, otp)
      // );

      // res.status(200).json({
      //   success: true,
      //   otptoken: verificationToken,
      //   otp,
      // });
    }

    if (createdUser) {
      if (
        typeof body.permissions === "object" &&
        createdUser.role === "staff"
      ) {
        const permissions = await Permission.create({
          user: createdUser._id,
          permissions: body.permissions,
        });
      }
      const wallet = await Wallet.create({
        user: createdUser._id,
        balance: walletSetting.userDefaultBalance,
      });
      const bank = await Bank.create({ user: createdUser._id });
    }

    // send response
    res.send({
      type: "UserRegister",
      status: "success",
      message: "User registered successfully",
      user: user,
    });
  } catch (error) {
    console.log("error register: ", error);
    if (error.isJoi === true) error.status = 422;
    next(error);
  }
};

module.exports = registerUser;
