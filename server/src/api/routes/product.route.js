const controllers = require("../controllers/product.controller");
const {
  verifyTokenUser,
  verifyTokenAdmin,
} = require("../middlewares/verifyToken");
const upload = require("../../lib/multer");

const router = require("express").Router();
router.get("/", verifyTokenUser, controllers.getAllProducts);
router.get("/:id", verifyTokenUser, controllers.getProductById);
// router.post("/", verifyTokenUser, controllers.createProduct);
router.post(
  "/",
  verifyTokenUser,
  upload.single("image"),
  controllers.createProduct
);
router.put("/:id", verifyTokenUser, controllers.updateProduct);
router.delete("/:id", verifyTokenUser, controllers.deleteProduct);

module.exports = router;
