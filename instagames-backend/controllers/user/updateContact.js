const Contact = require("../../models/Contact.model");

const updateContact = async (req, res, next) => {
  try {
    const { user: _id, body } = req;
    const updatedContact = await Contact.findOneAndUpdate({ user: _id }, body);

    res.send({
      type: "UpdateContact: Self",
      status: "success",
      message: "Updated contact successfully",
      contact: updatedContact,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = updateContact;
