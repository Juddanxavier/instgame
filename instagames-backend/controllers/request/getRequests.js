const Request = require("../../models/request/Request.model");

const getRequests = async (req, res, next) => {
  try {
    const requests = await Request.find({ user: req.user._id })
      .populate("user")
      .sort({ createdAt: -1 });

    res.send({
      type: "GetRequests",
      status: "success",
      message: "Fetched all requests successfully",
      requests,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = getRequests;
