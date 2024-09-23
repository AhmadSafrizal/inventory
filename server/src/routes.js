const router = require("express").Router();
const userRoute = require("./api/routes/user.route");
const productRoute = require("./api/routes/product.route");
const categoryRoute = require("./api/routes/category.route");
const transactionTypeRoute = require("./api/routes/transactionType.route");
const transactionRoute = require("./api/routes/transaction.route");
// const { verifyTokenAdmin } = require("../src/api/middlewares/verifyToken");

// api routes
router.use("/api/user", userRoute);
router.use("/api/product", productRoute);
router.use("/api/category", categoryRoute);
router.use("/api/transaction-type", transactionTypeRoute);
router.use("/api/transaction", transactionRoute);

module.exports = router;
