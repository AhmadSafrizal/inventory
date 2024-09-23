const prisma = require("../../lib/prisma");
const CustomAPIError = require("../middlewares/custom-error");
const cloudinary = require("../../lib/cloudinary");

const fetchAllProducts = async ({ name, category_id, pageSize, page }) => {
  const validPageSize =
    parseInt(pageSize, 10) > 0 ? parseInt(pageSize, 10) : 10;
  const validPage = parseInt(page, 10) > 0 ? parseInt(page, 10) : 1;

  const categoryIdFilter = category_id ? parseInt(category_id, 10) : undefined;

  const products = await prisma.product.findMany({
    include: {
      category: true, // Include kategori
    },
    where: {
      name: name ? { contains: name } : undefined,
      category_id: categoryIdFilter,
    },
    skip: validPageSize * (validPage - 1),
    take: validPageSize,
  });

  const totalProducts = await prisma.product.count({
    where: {
      name: name ? { contains: name } : undefined,
      category_id: categoryIdFilter,
    },
  });

  return { products, totalProducts };
};

const fetchProductById = async (id) => {
  try {
    const productId = parseInt(id, 10);
    const product = await prisma.product.findUnique({
      include: {
        category: true,
      },
      where: {
        id: productId,
      },
    });

    if (!product) {
      throw new CustomAPIError(`No Product with id of ${id}`, 404);
    }

    return product;
  } catch (error) {
    throw new CustomAPIError(`${error.message}`, 500);
  }
};

const postProduct = async (data, file) => {
  try {
    const { name, description, category_id, price, stock } = data;

    if (!name || !price || !category_id) {
      throw new CustomAPIError(
        "Name, price, and category_id are required",
        400
      );
    }

    let imageUrl;

    // Proses upload gambar ke Cloudinary jika file ada
    if (file) {
      const result = await cloudinary.uploader.upload(file.path);
      imageUrl = result.secure_url; // URL gambar yang diunggah di Cloudinary
    }

    // Simpan produk ke database
    const product = await prisma.product.create({
      data: {
        name,
        description,
        category_id: parseInt(category_id),
        image: imageUrl || "", // Gunakan imageUrl dari Cloudinary
        stock: parseInt(stock),
        price: parseFloat(price),
      },
    });
    return product;
  } catch (error) {
    throw new CustomAPIError(`Error creating product: ${error.message}`, 500);
  }
};

const putProduct = async (id, data) => {
  try {
    const productId = parseInt(id, 10);

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new CustomAPIError(`No product with id of ${id}`, 404);
    }

    const { name, description, category_id, stock, price, image } = data;

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        name: name || product.name,
        description: description || product.description,
        category_id: category_id ? parseInt(category_id) : product.category_id,
        stock: stock ? parseInt(stock) : product.stock,
        price: price ? parseFloat(price) : product.price,
        image: image || product.image,
      },
    });

    return updatedProduct;
  } catch (error) {
    throw new CustomAPIError(`Error updating product: ${error.message}`, 500);
  }
};

const destroyProduct = async (id) => {
  try {
    const productId = parseInt(id, 10);
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new CustomAPIError(`No product with id ${productId}`, 404);
    }

    // Jika produk memiliki gambar, hapus dari Cloudinary
    if (product.image) {
      const imageUrl = product.image;
      const publicId = getPublicIdFromUrl(imageUrl); // Mendapatkan public_id dari URL gambar

      // Hapus gambar dari Cloudinary
      await cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) {
          throw new CustomAPIError(
            `Error deleting image from Cloudinary: ${error.message}`,
            500
          );
        }
        console.log(`Image ${publicId} deleted from Cloudinary`);
      });
    }

    // Hapus produk dari database setelah gambar dihapus
    await prisma.product.delete({
      where: {
        id: productId,
      },
    });

    return {
      deletedProduct: product,
    };
  } catch (error) {
    throw new CustomAPIError(`Error deleting product: ${error.message}`, 500);
  }
};

// Fungsi untuk mendapatkan public_id dari URL gambar
function getPublicIdFromUrl(url) {
  const parts = url.split("/");
  const lastPart = parts[parts.length - 1];
  const publicId = lastPart.split(".")[0]; // Menghapus ekstensi file (.jpg, .png, dll.)
  return publicId;
}

module.exports = {
  fetchAllProducts,
  fetchProductById,
  postProduct,
  putProduct,
  destroyProduct,
};
