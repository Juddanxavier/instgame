const Transaction = require("../../models/transaction/Transaction.model");
const Bank = require("../../models/bank/Bank.model");
const Contact = require("../../models/Contact.model");

const geAllTransactions = async (req, res, next) => {
  try {
    const { query } = req;
    const allTransactionsFiltered = await Transaction.find({
      type: { $in: query.type },
    })
      .populate("user")
      .sort({
        createdAt: -1,
      })
      .lean();

    const allTransactions = allTransactionsFiltered?.filter(
      (transaction) => transaction?.user
    );

    const userBanks = await Bank.find({
      user: { $in: allTransactions.map((transaction) => transaction.user._id) },
    }).lean();

    const userContacts = await Contact.find({
      user: {
        $in: allTransactions.map((transaction) => transaction.user._id),
      },
    });

    const response = allTransactions.map((transaction) => {
      const userBank = userBanks.find(
        (bank) => String(bank.user) === String(transaction.user._id)
      );
      const userContact = userContacts.find(
        (contact) => String(contact.user) === String(transaction.user._id)
      );
      return { ...transaction, bank: userBank, contact: userContact };
    });

    res.send({
      type: "GetTransaction: All",
      status: "success",
      message: "Fetched all transactions successfully",
      transactions: response,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = geAllTransactions;
