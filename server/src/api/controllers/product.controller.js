const productService = require("../services/product.service");
const CustomAPIError = require("../middlewares/custom-error");
const cloudinary = require("../../lib/cloudinary");
const upload = require("../../lib/multer");

const getAllProducts = async (req, res) => {
  try {
    const { name, category_id, pageSize = 10, page = 1 } = req.query;

    const { products, totalProducts } = await productService.fetchAllProducts({
      name,
      category_id,
      pageSize,
      page,
    });

    res.status(200).json({
      success: true,
      data: {
        products,
        totalProducts, // Mengirim total produk untuk paginasi
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getProductById = async (req, res) => {
  const { id } = req.params;
  const product = await productService.fetchProductById(id);
  if (!product) {
    throw new CustomAPIError("error fetching product", 404);
  }
  return res.json({
    status: "success",
    message: "Product is fetched successfully",
    data: product,
  });
};

const createProduct = async (req, res) => {
  try {
    // Log file yang diupload
    console.log("file: ", req.file);

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Panggil service untuk menyimpan produk
    const product = await productService.postProduct(req.body, req.file);

    return res.status(201).json({
      status: "success",
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateProduct = async (req, res) => {
  try {
    upload.single("image")(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }

      const { id } = req.params;
      const { name, description, category_id, stock, price } = req.body;
      const file = req.file;

      try {
        let image;

        if (file) {
          const cloudinaryResult = await cloudinary.uploader.upload(file.path);
          image = cloudinaryResult.secure_url;
        }

        const updatedProduct = await productService.putProduct(id, {
          name,
          description,
          category_id: parseInt(category_id),
          stock: parseInt(stock),
          price: parseFloat(price),
          image,
        });

        return res.status(200).json({
          status: "success",
          message: "Product is updated successfully",
          data: updatedProduct,
        });
      } catch (error) {
        return res
          .status(500)
          .json({ error: `Error updating product: ${error.message}` });
      }
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedProduct = await productService.destroyProduct(id);

    return res.json({
      status: "success",
      message: "Product is deleted successfully",
      data: deletedProduct,
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
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
