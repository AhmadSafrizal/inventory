const controllers = require("../controllers/user.controller");
const {
  verifyTokenUser,
  verifyTokenAdmin,
} = require("../middlewares/verifyToken");

const router = require("express").Router();
router.get("/", verifyTokenUser, controllers.getAllUsers);
router.get("/:id", verifyTokenUser, controllers.getUserDetail);
router.post("/register", controllers.registerUser);
router.post("/login", controllers.loginUser);
router.put("/:id", verifyTokenUser, controllers.updateUser);
router.delete("/:id", verifyTokenUser, controllers.deleteUser);

module.exports = router;
