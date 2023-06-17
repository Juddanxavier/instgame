const Bank = require("../../models/bank/Bank.model");

const updateBank = async (req, res, next) => {
  try {
    const { user: _id, body } = req;
    const updatedBank = await Bank.findOneAndUpdate({ user: _id }, body);

    res.send({
      type: "UpdateBank: Self",
      status: "success",
      message: "Updated bank successfully",
      users: updatedBank,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = updateBank;
