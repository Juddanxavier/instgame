const Request = require("../../models/request/Request.model");
const Bank = require("../../models/bank/Bank.model");
const Contact = require("../../models/Contact.model");

const getSingleRequest = async (req, res, next) => {
  try {
    const {
      params: { id },
    } = req;
    const request = await Request.findById(id).populate("user").lean();

    const userBank = await Bank.findOne({
      user: request.user._id,
    }).lean();

    const userContact = await Contact.findOne({
      user: request.user._id,
    }).lean();

    const response = { ...request, bank: userBank, contact: userContact };

    res.send({
      type: "GetRequest: Fetch",
      status: "success",
      message: "Request fetched successfully",
      request: response,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = getSingleRequest;
