const db = require("../pool");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const { secret } = require("../config");

const genAccessToken = (prop) => {
  const payload = { prop };
  return jwt.sign(payload, secret, { expiresIn: "24h" });
};

class UserController {
  async getUsers(req, res) {
    try {
      const users = await db.query("SELECT * FROM users");
      res.json(users.rows);
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: "Ошибка запроса" });
    }
  }

  async getOneUser(req, res) {
    try {
      const id = req.params.id;
      const user = await db.query("SELECT * FROM users where id = $1", [id]);
      if (!user.rows[0]) {
        return res.status(400).json({ message: "Пользователь не найден" });
      }
      res.json(user.rows);
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: "Ошибка запроса" });
    }
  }

  async registration(req, res) {
    try {
      // валидация ввода
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: "Ошибка ввода" });
      }
      const { name, pass } = req.body;
      const preUser = await db.query("SELECT * FROM users where name = $1", [
        name,
      ]);

      // проверка на наличие логина в базе
      if (preUser.rows[0]) {
        return res.status(400).json({ message: "Пользователь уже существует" });
      }

      // хеширование пароля
      const hashPass = bcrypt.hashSync(pass, 6);

      // запись в базу
      const newUser = await db.query(
        "INSERT INTO users (name, pass) values ($1, $2) RETURNING *",
        [name, hashPass]
      );

      const user = await db.query("SELECT * FROM users where name = $1", [
        name,
      ]);

      const token = genAccessToken(user.rows[0].name);
      res.status(200).json({
        message: "Успешная регистрация",
        token,
        name: jwt.verify(token, secret),
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: "Ошибка регистрации" });
    }
  }

  async login(req, res) {
    try {
      const { name, pass } = req.body;
      const user = await db.query("SELECT * FROM users where name = $1", [
        name,
      ]);

      // поиск пользователя в базе
      if (!user.rows[0]) {
        return res.status(400).json({ message: "Пользователь не найден" });
      }

      // валидация пароля
      const validPass = bcrypt.compareSync(pass, user.rows[0].pass);
      if (!validPass) {
        return res.status(400).json({ message: "Неправильный пароль" });
      }

      const token = genAccessToken(user.rows[0].name);
      return res.json({ token, name: jwt.verify(token, secret) });
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: "Ошибка входа" });
    }
  }
}

module.exports = new UserController();
