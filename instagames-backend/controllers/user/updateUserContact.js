const Contact = require("../../models/Contact.model");

const updateContact = async (req, res, next) => {
  try {
    const {
      params: { id },
      body,
    } = req;

    const updatedContact = await Contact.findOneAndUpdate({ user: id }, body);

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
