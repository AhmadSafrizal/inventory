const prisma = require("../../lib/prisma");
const CustomAPIError = require("../middlewares/custom-error");

const fetchAllTransactions = async (
  transactionType_id,
  startDate,
  endDate,
  page = 1,
  pageSize = 50
) => {
  try {
    // Tambahkan satu hari ke endDate
    let adjustedEndDate = endDate ? new Date(endDate) : undefined;
    if (adjustedEndDate) {
      adjustedEndDate.setDate(adjustedEndDate.getDate() + 1);
    }

    const transaction = await prisma.transaction.findMany({
      include: {
        product: true,
        transactionType: true,
      },
      where: {
        transactionType_id: transactionType_id
          ? parseInt(transactionType_id)
          : undefined,
        createdAt: {
          gte: startDate ? new Date(startDate) : undefined,
          lt: adjustedEndDate,
        },
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: {
        createdAt: "desc",
      },
    });

    const totalTransactionCount = await prisma.transaction.count({
      where: {
        transactionType_id: transactionType_id
          ? parseInt(transactionType_id)
          : undefined,
        createdAt: {
          gte: startDate ? new Date(startDate) : undefined,
          lt: adjustedEndDate,
        },
      },
    });

    if (transaction.length === 0) {
      return {
        transaction: [],
        totalTransactionCount: 0,
      };
    }

    return {
      transaction,
      totalTransactionCount,
    };
  } catch (error) {
    throw new CustomAPIError(
      `Error fetching transactions: ${error.message}`,
      error.statusCode || 500
    );
  }
};

// const fetchTransactionById = async (id) => {
//   try {
//     const transactionId = parseInt(id, 10);
//     const transaction = await prisma.transaction.findUnique({
//       where: {
//         id: transactionId,
//       },
//     });

//     if (!transaction) {
//       throw new CustomAPIError(`No Transaction with id of ${id}`, 404);
//     }

//     return transaction;
//   } catch (error) {
//     throw new CustomAPIError(`${error.message}`, 500);
//   }
// };

const postTransaction = async (data) => {
  try {
    const { transactionType_id, product_id, quantity } = data;

    // Validasi input
    if (!transactionType_id || !product_id || !quantity) {
      throw new CustomAPIError(
        "Transaction Type Id, Product Id, and quantity are required",
        400
      );
    }

    // Cari product berdasarkan product_id
    const product = await prisma.product.findUnique({
      where: { id: product_id },
    });

    if (!product) {
      throw new CustomAPIError(`No product found with id ${product_id}`, 404);
    }

    // Lihat jenis transaction type
    const transactionType = await prisma.transactionType.findUnique({
      where: { id: transactionType_id },
    });

    if (!transactionType) {
      throw new CustomAPIError(
        `No transaction type found with id ${transactionType_id}`,
        404
      );
    }

    // Logika untuk menambah atau mengurangi stok
    let newStock;
    if (transactionType_id === 1 && transactionType.type === "masuk") {
      // Stok bertambah jika tipe "masuk"
      newStock = product.stock + quantity;
    } else {
      // Stok berkurang jika bukan tipe "masuk"
      newStock = product.stock - quantity;

      // Pastikan stok tidak menjadi negatif
      if (newStock < 0) {
        throw new CustomAPIError("Insufficient stock", 400);
      }
    }

    // Update stok produk
    await prisma.product.update({
      where: { id: product_id },
      data: { stock: newStock },
    });

    // Simpan transaksi ke database
    const transaction = await prisma.transaction.create({
      data: {
        transactionType_id,
        product_id,
        quantity,
      },
    });

    return transaction;
  } catch (error) {
    throw new CustomAPIError(
      `Error creating transaction: ${error.message}`,
      500
    );
  }
};

// const putTransaction = async (id, data) => {
//   try {
//     const transactionId = parseInt(id, 10);

//     const transaction = await prisma.transaction.findUnique({
//       where: { id: transactionId },
//     });

//     if (!transaction) {
//       throw new CustomAPIError(`No transaction with id of ${id}`, 404);
//     }

//     const { transactionType_id } = data;

//     const updatedTransaction = await prisma.transaction.update({
//       where: { id: transactionId },
//       data: {
//         transactionType_id:
//           transactionType_id || transaction.transactionType_id,
//       },
//     });

//     return updatedTransaction;
//   } catch (error) {
//     throw new CustomAPIError(
//       `Error updating transaction: ${error.message}`,
//       500
//     );
//   }
// };

// const destroyTransaction = async (id) => {
//   try {
//     const transactionId = parseInt(id, 10);
//     const transaction = await prisma.transaction.findUnique({
//       where: { id: transactionId },
//     });

//     if (!transaction) {
//       throw new CustomAPIError(`No transaction with id ${transactionId}`, 404);
//     }

//     // Hapus produk dari database setelah gambar dihapus
//     await prisma.transaction.delete({
//       where: {
//         id: transactionId,
//       },
//     });

//     return {
//       deletedTransaction: transaction,
//     };
//   } catch (error) {
//     throw new CustomAPIError(
//       `Error deleting transaction: ${error.message}`,
//       500
//     );
//   }
// };

module.exports = {
  fetchAllTransactions,
  //   fetchTransactionById,
  postTransaction,
  //   putTransaction,
  //   destroyTransaction,
};
