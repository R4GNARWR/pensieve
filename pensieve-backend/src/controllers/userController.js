import crypto from "crypto";
import { Op } from "sequelize";
import User from "../models/user.js";
import jsonwebtoken from "jsonwebtoken";
import RefreshToken from "../models/refresh.js";
import ApiResponse from "../utils/apiResponse.js";
import { validationResult } from "express-validator";
import SpaceService from "../services/space-service.js";

const { sign, verify } = jsonwebtoken;

const JWT_ISSUER = "pensieve";
const JWT_AUDIENCE = "pensieve-client";

const generateAccessToken = (user) => {
  return sign(
    {
      id: user.id,
      username: user.username,
      name: user.name,
    },
    process.env.SECRET_KEY,
    {
      expiresIn: "24h",
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    }
  );
};

const generateRefreshToken = (id) => {
  return sign({ id }, process.env.REFRESH_SECRET_KEY, {
    expiresIn: "7d",
    issuer: JWT_ISSUER,
    audience: JWT_AUDIENCE,
  });
};

const comparePasswords = (inputPass, storedPass, salt) => {
  const inputHash = crypto.scryptSync(inputPass, salt, 64);
  const storedHash = Buffer.from(storedPass, "base64");
  return (
    inputHash.length === storedHash.length &&
    crypto.timingSafeEqual(inputHash, storedHash)
  );
};

class authController {
  async refreshToken(req, res) {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json(ApiResponse.error("Токен отсутствует", 401));
    }

    try {
      const storedToken = await RefreshToken.findOne({
        where: { token: refreshToken },
        include: User,
      });

      if (!storedToken) {
        return res.status(403).json(ApiResponse.error("Невалидный токен", 403));
      }

      if (new Date() > storedToken.expiresAt) {
        await storedToken.destroy();
        return res.status(403).json(ApiResponse.error("Токен истек", 403));
      }

      if (!storedToken.User) {
        return res.status(403).json(ApiResponse.error("Пользователь не найден", 403));
      }

      const decoded = verify(refreshToken, process.env.REFRESH_SECRET_KEY, {
        issuer: JWT_ISSUER,
        audience: JWT_AUDIENCE,
      });

      if (decoded.id !== storedToken.User.id) {
        await storedToken.destroy();
        return res.status(403).json(ApiResponse.error("Невалидный токен", 403));
      }

      const newAccessToken = generateAccessToken(storedToken.User);
      const newRefreshToken = generateRefreshToken(storedToken.User.id);

      await storedToken.update({
        token: newRefreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });

      res.json(
        ApiResponse.success({
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        })
      );
    } catch (e) {
      console.error(e);
      if (e.name === "JsonWebTokenError" || e.name === "TokenExpiredError") {
        return res.status(403).json(ApiResponse.error("Невалидный токен", 403));
      }
      res.status(500).json(ApiResponse.error("Ошибка сервера", 500));
    }
  }

  async login(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json(ApiResponse.error(errors.array()[0].msg));
      }
      const { username } = req.body;

      const user = await User.findOne({ where: { username } });
      if (!user) {
        return res
          .status(404)
          .json(ApiResponse.error("Пользователь с таким логином не найден", 404));
      }
      if (comparePasswords(req.body.password, user.password, user.salt) === false) {
        return res.status(400).json(ApiResponse.error("Неверный пароль", 400));
      }

      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user.id);

      await RefreshToken.create({
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });

      res.json(
        ApiResponse.success({
          user: {
            id: user.id,
            name: user.name,
            username: user.username,
          },
          access_token: accessToken,
          refresh_token: refreshToken,
        })
      );
    } catch (e) {
      res.status(500).json(ApiResponse.error("Ошибка сервера", 500));
      console.log(e);
    }
  }

  async register(req, res) {
    if (process.env.ALLOW_REGISTRATION === "false") {
      return res.status(403).json(ApiResponse.error("Регистрация закрыта", 403));
    }

    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json(ApiResponse.error(errors.array()[0].msg));
      }

      const { name, username, password } = req.body;

      const existing = await User.findOne({ where: { username } });
      if (existing) {
        return res
          .status(400)
          .json(ApiResponse.error("Пользователь с таким логином уже существует", 400));
      }

      const salt = crypto.randomBytes(16).toString("base64");
      const hashedPassword = crypto.scryptSync(password, salt, 64).toString("base64");

      const user = await User.create({ name, username, password: hashedPassword, salt });
      await SpaceService.createUserSpace(user.id, "Personal");

      const access_token = generateAccessToken(user);
      const refresh_token = generateRefreshToken(user.id);

      res.status(201).json(
        ApiResponse.success({
          user: {
            id: user.id,
            name: user.name,
            username: user.username,
          },
          access_token,
          refresh_token,
        })
      );
    } catch (e) {
      res.status(500).json(ApiResponse.error("Ошибка сервера", 500));
      console.log(e);
    }
  }

  async authorize(req, res) {
    try {
      const user = {
        id: req.user?.id,
        username: req.user?.username,
        name: req.user?.name,
      };
      res.json(ApiResponse.success(user, 200));
    } catch (e) {
      res.status(500).json(ApiResponse.error("Ошибка сервера", 500));
      console.log(e);
    }
  }

  async logout(req, res) {
    try {
      const { id } = req.user;
      await RefreshToken.destroy({ where: { userId: id } });
      res.status(200).json(ApiResponse.success("Вы успешно вышли", 200));
    } catch (e) {
      console.error("Logout error:", e);
      res.status(500).json(ApiResponse.error("Ошибка сервера", 500));
    }
  }

  async getUsers(req, res) {
    try {
      const users = await User.findAll({
        where: { id: { [Op.ne]: req.user.id } },
        attributes: ["id", "username", "name"],
      });
      res.json(ApiResponse.success(users));
    } catch (e) {
      res.status(500).json(ApiResponse.error("Ошибка сервера", 500));
      console.log(e);
    }
  }
}

export default new authController();
