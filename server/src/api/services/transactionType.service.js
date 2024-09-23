const prisma = require("../../lib/prisma");
const CustomAPIError = require("../middlewares/custom-error");

const fetchAllTransactionTypes = async (type, page = 1, pageSize = 10) => {
  try {
    const transactionType = await prisma.transactionType.findMany({
      where: {
        type: type ? { contains: type, mode: "insensitive" } : undefined, // Optional filter by type
      },
      skip: (page - 1) * pageSize, // Skip berdasarkan page
      take: pageSize, // Jumlah data yang diambil per page
    });

    const totalTransactionTypeCount = await prisma.transactionType.count({
      where: {
        type: type ? { contains: type, mode: "insensitive" } : undefined,
      },
    });

    if (transactionType.length === 0) {
      return {
        transactionType: [],
        totalTransactionTypeCount: 0,
      };
    }

    return {
      transactionType,
      totalTransactionTypeCount,
    };
  } catch (error) {
    throw new CustomAPIError(
      `Error fetching transaction types: ${error.message}`,
      error.statusCode || 500
    );
  }
};

const fetchTransactionTypeById = async (id) => {
  try {
    const transactionTypeId = parseInt(id, 10);
    const transactionType = await prisma.transactionType.findUnique({
      where: {
        id: transactionTypeId,
      },
    });

    if (!transactionType) {
      throw new CustomAPIError(`No TransactionType with id of ${id}`, 404);
    }

    return transactionType;
  } catch (error) {
    throw new CustomAPIError(`${error.message}`, 500);
  }
};

const postTransactionType = async (data) => {
  try {
    const { type } = data;

    if (!type) {
      throw new CustomAPIError("TransactionType_name are required", 400);
    }

    // Simpan produk ke database
    const transactionType = await prisma.transactionType.create({
      data: {
        type,
      },
    });
    return transactionType;
  } catch (error) {
    throw new CustomAPIError(
      `Error creating transactionType: ${error.message}`,
      500
    );
  }
};

const putTransactionType = async (id, data) => {
  try {
    const transactionTypeId = parseInt(id, 10);

    const transactionType = await prisma.transactionType.findUnique({
      where: { id: transactionTypeId },
    });

    if (!transactionType) {
      throw new CustomAPIError(`No transactionType with id of ${id}`, 404);
    }

    const { type } = data;

    const updatedTransactionType = await prisma.transactionType.update({
      where: { id: transactionTypeId },
      data: {
        type: type || transactionType.type,
      },
    });

    return updatedTransactionType;
  } catch (error) {
    throw new CustomAPIError(
      `Error updating transactionType: ${error.message}`,
      500
    );
  }
};

const destroyTransactionType = async (id) => {
  try {
    const transactionTypeId = parseInt(id, 10);
    const transactionType = await prisma.transactionType.findUnique({
      where: { id: transactionTypeId },
    });

    if (!transactionType) {
      throw new CustomAPIError(
        `No transactionType with id ${transactionTypeId}`,
        404
      );
    }

    // Hapus produk dari database setelah gambar dihapus
    await prisma.transactionType.delete({
      where: {
        id: transactionTypeId,
      },
    });

    return {
      deletedTransactionType: transactionType,
    };
  } catch (error) {
    throw new CustomAPIError(
      `Error deleting transactionType: ${error.message}`,
      500
    );
  }
};

module.exports = {
  fetchAllTransactionTypes,
  fetchTransactionTypeById,
  postTransactionType,
  putTransactionType,
  destroyTransactionType,
};
