const Request = require("../../models/request/Request.model");
const Bank = require("../../models/bank/Bank.model");
const Contact = require("../../models/Contact.model");
const Transaction = require("../../models/transaction/Transaction.model");

const getAllRequests = async (req, res, next) => {
  try {
    const { query } = req;
    const requestsFiltered = await Request.find({
      type: {
        $in: query.type,
      },
    })
      .populate(["user", "raisedBy"])
      .sort({ createdAt: -1 })
      .lean();

    const requests = requestsFiltered?.filter((request) => request?.user);

    const transactions = await Transaction.find({
      request: requests?.map((request) => String(request?._id)),
    });

    const userBanks = await Bank.find({
      user: { $in: requests.map((request) => request.user?._id) },
    }).lean();

    const userContacts = await Contact.find({
      user: {
        $in: requests.map((request) => request.user?._id),
      },
    });

    const response = requests.map((request) => {
      const userBank = userBanks.find(
        (bank) => String(bank.user) === String(request?.user?._id)
      );
      const userContact = userContacts.find(
        (contact) => String(contact.user) === String(request?.user?._id)
      );

      const concurrentTransaction = transactions.find(
        (transaction) => String(transaction?.request) === String(request?._id)
      );

      return {
        ...request,
        bank: userBank,
        contact: userContact,
        transaction: concurrentTransaction,
      };
    });

    res.send({
      type: "GetRequests",
      status: "success",
      message: "Fetched all requests successfully",
      requests: response,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = getAllRequests;
