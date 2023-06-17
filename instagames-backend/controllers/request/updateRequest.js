const Request = require("../../models/request/Request.model");

const updateRequest = async (req, res, next) => {
  try {
    const {
      params: { id },
      body,
    } = req;
    const request = await Request.findByIdAndUpdate(id, body);

    res.send({
      type: "UpdateRequest: Update",
      status: "success",
      message: "Request updated successfully",
      request,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = updateRequest;
