const transactionService = require("../services/transaction.service");
const CustomAPIError = require("../middlewares/custom-error");

const getAllTransaction = async (req, res) => {
  const {
    page = 1,
    pageSize = 10,
    transactionType_id,
    startDate,
    endDate,
  } = req.query; // Default page dan pageSize jika tidak ada

  try {
    const { transaction, totalTransactionCount } =
      await transactionService.fetchAllTransactions(
        transactionType_id,
        startDate,
        endDate,
        parseInt(page),
        parseInt(pageSize)
      );

    const totalPages = Math.ceil(totalTransactionCount / parseInt(pageSize));

    return res.json({
      status: "success",
      message: "All transaction types are presented",
      data: {
        transaction,
        totalPages,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// const getTransactionById = async (req, res) => {
//   const { id } = req.params;
//   const transaction = await transactionService.fetchTransactionById(id);
//   if (!transaction) {
//     throw new CustomAPIError("error fetching transaction", 404);
//   }
//   return res.json({
//     status: "success",
//     message: "Transaction is fetched successfully",
//     data: transaction,
//   });
// };

const createTransaction = async (req, res) => {
  try {
    const transaction = await transactionService.postTransaction(req.body);
    return res.status(201).json({
      status: "success",
      message: "Transaction created successfully",
      data: transaction,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// const updateTransaction = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { type } = req.body;

//     const updatedTransaction =
//       await transactionService.putTransaction(id, {
//         type,
//       });

//     return res.status(200).json({
//       status: "success",
//       message: "Transaction is updated successfully",
//       data: updatedTransaction,
//     });
//   } catch (error) {
//     return res.status(500).json({ error: error.message });
//   }
// };

// const deleteTransaction = async (req, res) => {
//   const { id } = req.params;

//   try {
//     const deletedTransaction =
//       await transactionService.destroyTransaction(id);

//     return res.json({
//       status: "success",
//       message: "Transaction is deleted successfully",
//       data: deletedTransaction,
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(error.statusCode || 500).json({
//       status: "error",
//       message: error.message || "Internal Server Error",
//     });
//   }
// };

module.exports = {
  getAllTransaction,
  //   getTransactionById,
  createTransaction,
  //   updateTransaction,
  //   deleteTransaction,
};
