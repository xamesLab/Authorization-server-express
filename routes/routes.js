const Router = require("express");
const router = new Router();
const userController = require("../controllers/controllers");
const { check } = require("express-validator");
const middleware = require("../middleware/middleware");

router.post(
  "/registration",
  [
    check("name", "Поле не может быть пустым").notEmpty(),
    check("pass", "от 6 до 20 символов").isLength({ min: 6, max: 20 }),
  ],
  userController.registration
);
router.post("/login", userController.login);
router.get("/users", middleware, userController.getUsers);
router.get("/user/:id", middleware, userController.getOneUser);

module.exports = router;
