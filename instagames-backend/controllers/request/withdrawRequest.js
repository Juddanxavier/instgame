const Request = require("../../models/request/Request.model");

const withdrawRequest = async (req, res, next) => {
  try {
    const { body } = req;

    const withdrawRequestData = {
      type: "withdraw",
      user: req.user._id,
      raisedBy: req.user._id,
      amount: body.amount,
    };

    const requests = await Request.insertMany(withdrawRequestData);

    res.send({
      type: "CreateRequest : WithdrawMoney",
      status: "success",
      message: "Request created successfully",
      requests,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = withdrawRequest;
