const controllers = require("../controllers/category.controller");
const {
  verifyTokenUser,
  verifyTokenAdmin,
} = require("../middlewares/verifyToken");

const router = require("express").Router();
router.get("/", verifyTokenUser, controllers.getAllCategories);
router.get("/:id", verifyTokenUser, controllers.getCategoryById);
router.post("/", verifyTokenUser, controllers.createCategory);
router.put("/:id", verifyTokenUser, controllers.updateCategory);
router.delete("/:id", verifyTokenUser, controllers.deleteCategory);

module.exports = router;
