const controllers = require("../controllers/transaction.controller");
const {
  verifyTokenUser,
  verifyTokenAdmin,
} = require("../middlewares/verifyToken");

const router = require("express").Router();
router.get("/", verifyTokenUser, controllers.getAllTransaction);
// router.get("/:id", verifyTokenUser, controllers.getTransactionById);
router.post("/", verifyTokenUser, controllers.createTransaction);
// router.put("/:id", verifyTokenUser, controllers.updateTransaction);
// router.delete("/:id", verifyTokenUser, controllers.deleteTransaction);

module.exports = router;
