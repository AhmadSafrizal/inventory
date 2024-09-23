const transactionTypeService = require("../services/transactionType.service");
const CustomAPIError = require("../middlewares/custom-error");

const getAllTransactionType = async (req, res) => {
  const { page = 1, pageSize = 10, type } = req.query; // Default page dan pageSize jika tidak ada

  try {
    const { transactionType, totalTransactionTypeCount } =
      await transactionTypeService.fetchAllTransactionTypes(
        type,
        parseInt(page),
        parseInt(pageSize)
      );

    const totalPages = Math.ceil(
      totalTransactionTypeCount / parseInt(pageSize)
    );

    return res.json({
      status: "success",
      message: "All transaction types are presented",
      data: {
        transactionType,
        totalPages,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getTransactionTypeById = async (req, res) => {
  const { id } = req.params;
  const transactionType = await transactionTypeService.fetchTransactionTypeById(
    id
  );
  if (!transactionType) {
    throw new CustomAPIError("error fetching transactionType", 404);
  }
  return res.json({
    status: "success",
    message: "TransactionType is fetched successfully",
    data: transactionType,
  });
};

const createTransactionType = async (req, res) => {
  try {
    const transactionType = await transactionTypeService.postTransactionType(
      req.body
    );
    return res.status(201).json({
      status: "success",
      message: "TransactionType created successfully",
      data: transactionType,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateTransactionType = async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.body;

    const updatedTransactionType =
      await transactionTypeService.putTransactionType(id, {
        type,
      });

    return res.status(200).json({
      status: "success",
      message: "TransactionType is updated successfully",
      data: updatedTransactionType,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const deleteTransactionType = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedTransactionType =
      await transactionTypeService.destroyTransactionType(id);

    return res.json({
      status: "success",
      message: "TransactionType is deleted successfully",
      data: deletedTransactionType,
    });
  } catch (error) {
    console.error(error);
    return res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message || "Internal Server Error",
    });
  }
};

module.exports = {
  getAllTransactionType,
  getTransactionTypeById,
  createTransactionType,
  updateTransactionType,
  deleteTransactionType,
};
