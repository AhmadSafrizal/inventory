const controllers = require("../controllers/transactionType.controller");
const {
  verifyTokenUser,
  verifyTokenAdmin,
} = require("../middlewares/verifyToken");

const router = require("express").Router();
router.get("/", verifyTokenUser, controllers.getAllTransactionType);
router.get("/:id", verifyTokenUser, controllers.getTransactionTypeById);
router.post("/", verifyTokenUser, controllers.createTransactionType);
router.put("/:id", verifyTokenUser, controllers.updateTransactionType);
router.delete("/:id", verifyTokenUser, controllers.deleteTransactionType);

module.exports = router;
