const Bank = require("../../models/bank/Bank.model");

const depositRequest = async (req, res, next) => {
  try {
    const {
      params: { id },
      body,
    } = req;

    const updatedBank = await Bank.findOneAndUpdate({ user: id }, body);

    res.send({
      type: "BankUpdate",
      status: "success",
      message: "Bank updated successfully",
      bank: updatedBank,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = depositRequest;
