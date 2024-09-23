const prisma = require("../../lib/prisma");
const CustomAPIError = require("../middlewares/custom-error");

const fetchAllCategories = async (category_name, page = 1, pageSize = 50) => {
  try {
    const validPage = parseInt(page, 10) > 0 ? parseInt(page, 10) : 1;
    const validPageSize =
      parseInt(pageSize, 10) > 0 ? parseInt(pageSize, 10) : 10;

    const categories = await prisma.category.findMany({
      where: {
        category_name: category_name
          ? {
              contains: category_name,
              // mode: "insensitive"
            }
          : undefined,
      },
      skip: (validPage - 1) * validPageSize,
      take: validPageSize,
    });

    const totalCategoriesCount = await prisma.category.count({
      where: {
        category_name: category_name
          ? {
              contains: category_name,
              // mode: "insensitive"
            }
          : undefined,
      },
    });

    // Jika produk tidak ditemukan
    if (categories.length === 0) {
      throw new CustomAPIError("No categories found", 404);
    }

    return {
      categories,
      totalCategoriesCount,
    };
  } catch (error) {
    throw new CustomAPIError(
      `Error fetching categories: ${error.message}`,
      error.statusCode || 500
    );
  }
};

const fetchCategoryById = async (id) => {
  try {
    const categoryId = parseInt(id, 10);
    const category = await prisma.category.findUnique({
      where: {
        id: categoryId,
      },
    });

    if (!category) {
      throw new CustomAPIError(`No Category with id of ${id}`, 404);
    }

    return category;
  } catch (error) {
    throw new CustomAPIError(`${error.message}`, 500);
  }
};

const postCategory = async (data, file) => {
  try {
    const { category_name } = data;

    if (!category_name) {
      throw new CustomAPIError("Category_name are required", 400);
    }

    // Simpan produk ke database
    const category = await prisma.category.create({
      data: {
        category_name,
      },
    });
    return category;
  } catch (error) {
    throw new CustomAPIError(`Error creating category: ${error.message}`, 500);
  }
};

const putCategory = async (id, data) => {
  try {
    const categoryId = parseInt(id, 10);

    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      throw new CustomAPIError(`No category with id of ${id}`, 404);
    }

    const { category_name } = data;

    const updatedCategory = await prisma.category.update({
      where: { id: categoryId },
      data: {
        category_name: category_name || category.category_name,
      },
    });

    return updatedCategory;
  } catch (error) {
    throw new CustomAPIError(`Error updating category: ${error.message}`, 500);
  }
};

const destroyCategory = async (id) => {
  try {
    const categoryId = parseInt(id, 10);
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      throw new CustomAPIError(`No category with id ${categoryId}`, 404);
    }

    // Hapus produk dari database setelah gambar dihapus
    await prisma.category.delete({
      where: {
        id: categoryId,
      },
    });

    return {
      deletedCategory: category,
    };
  } catch (error) {
    throw new CustomAPIError(`Error deleting category: ${error.message}`, 500);
  }
};

module.exports = {
  fetchAllCategories,
  fetchCategoryById,
  postCategory,
  putCategory,
  destroyCategory,
};
