const Request = require("../../models/request/Request.model");
const _ = require("lodash");

const depositRequestFromAdmin = async (req, res, next) => {
  try {
    const { body, query } = req;
    const data = body.map((request) => ({
      type: "deposit",
      user: query?.user,
      raisedBy: req?.user?._id,
      image: _.pick(request, ["url", "thumbnailUrl"]),
    }));

    const requests = await Request.insertMany(data);

    res.send({
      type: "CreateRequest : DepositMoney",
      status: "success",
      message: "Request created successfully",
      requests,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = depositRequestFromAdmin;
