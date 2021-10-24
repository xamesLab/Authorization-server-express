const jwt = require("jsonwebtoken");
const { secret } = require("../config");

module.exports = function (req, res, next) {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(403).json({ message: "Пользователь не авторизован" });
    }

    const tokenData = jwt.verify(token.split(" ")[1], secret);
    req.user = tokenData;

    next();
  } catch (error) {
    console.log("not");
    return res.status(403).json({ message: "Пользователь не авторизован" });
  }
};
