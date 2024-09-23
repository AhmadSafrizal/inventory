const categoryService = require("../services/category.service");
const CustomAPIError = require("../middlewares/custom-error");

const getAllCategories = async (req, res) => {
  const { page, pageSize, category_name } = req.query;

  try {
    const { categories, totalCategoriesCount } =
      await categoryService.fetchAllCategories(
        category_name,
        parseInt(page),
        parseInt(pageSize)
      );

    const totalPages = Math.ceil(totalCategoriesCount / parseInt(pageSize));

    return res.json({
      status: "success",
      message: "All categories are presented",
      data: {
        categories,
        totalPages,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getCategoryById = async (req, res) => {
  const { id } = req.params;
  const category = await categoryService.fetchCategoryById(id);
  if (!category) {
    throw new CustomAPIError("error fetching category", 404);
  }
  return res.json({
    status: "success",
    message: "Category is fetched successfully",
    data: category,
  });
};

const createCategory = async (req, res) => {
  try {
    const category = await categoryService.postCategory(req.body);
    return res.status(201).json({
      status: "success",
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { category_name } = req.body;

    const updatedCategory = await categoryService.putCategory(id, {
      category_name,
    });

    return res.status(200).json({
      status: "success",
      message: "Category is updated successfully",
      data: updatedCategory,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedCategory = await categoryService.destroyCategory(id);

    return res.json({
      status: "success",
      message: "Category is deleted successfully",
      data: deletedCategory,
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
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
