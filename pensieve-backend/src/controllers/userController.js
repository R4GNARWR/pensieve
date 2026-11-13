import crypto from "crypto";
import { Op } from "sequelize";
import User from "../models/user.js";
import jsonwebtoken from "jsonwebtoken";
import RefreshToken from "../models/refresh.js";
import ApiResponse from "../utils/apiResponse.js";
import { validationResult } from "express-validator";
import SpaceService from "../services/space-service.js";
import {
  ACCESS_TOKEN_TTL_SECONDS,
  REFRESH_TOKEN_TTL_MS,
  REFRESH_TOKEN_TTL_SECONDS,
} from "../constants/auth.js";

const { sign, verify } = jsonwebtoken;

const JWT_ISSUER = "pensieve";
const JWT_AUDIENCE = "pensieve-client";

/** Создаёт access-токен с пользовательскими данными на 2 часа */
const generateAccessToken = (user) => {
  return sign(
    {
      id: user.id,
      username: user.username,
      name: user.name,
    },
    process.env.SECRET_KEY,
    {
      expiresIn: ACCESS_TOKEN_TTL_SECONDS,
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    }
  );
};

/** Создаёт уникальный refresh-токен на 14 дней */
const generateRefreshToken = (id) => {
  return sign({ id }, process.env.REFRESH_SECRET_KEY, {
    expiresIn: REFRESH_TOKEN_TTL_SECONDS,
    issuer: JWT_ISSUER,
    audience: JWT_AUDIENCE,
    jwtid: crypto.randomUUID(),
  });
};

/** Сохраняет refresh-токен с привязкой к пользователю и сроком жизни */
const createRefreshToken = async (userId) => {
  const token = generateRefreshToken(userId);
  await RefreshToken.create({
    token,
    userId,
    expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
  });
  return token;
};

/** Удаляет из БД все просроченные refresh-токены */
const cleanupExpiredRefreshTokens = async () => {
  await RefreshToken.destroy({
    where: { expiresAt: { [Op.lt]: new Date() } },
  });
};

/** Проверяет пароль по сохранённому хэшу и соли */
const comparePasswords = (inputPass, storedPass, salt) => {
  const inputHash = crypto.scryptSync(inputPass, salt, 64);
  const storedHash = Buffer.from(storedPass, "base64");
  return (
    inputHash.length === storedHash.length &&
    crypto.timingSafeEqual(inputHash, storedHash)
  );
};

class authController {
  /** Выдаёт новую пару токенов и заменяет использованный refresh в БД */
  async refreshToken(req, res) {
    const { refresh_token: refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json(ApiResponse.error("Токен отсутствует", 401));
    }

    try {
      const decoded = verify(refreshToken, process.env.REFRESH_SECRET_KEY, {
        issuer: JWT_ISSUER,
        audience: JWT_AUDIENCE,
      });
      const storedToken = await RefreshToken.findOne({
        where: { token: refreshToken },
      });

      if (!storedToken) {
        return res.status(403).json(ApiResponse.error("Невалидный токен", 403));
      }

      if (new Date() > storedToken.expiresAt) {
        await storedToken.destroy();
        return res.status(403).json(ApiResponse.error("Токен истек", 403));
      }

      if (decoded.id !== storedToken.userId) {
        await storedToken.destroy();
        return res.status(403).json(ApiResponse.error("Невалидный токен", 403));
      }

      const user = await User.findByPk(decoded.id);
      if (!user) {
        await storedToken.destroy();
        return res.status(403).json(ApiResponse.error("Пользователь не найден", 403));
      }

      const newAccessToken = generateAccessToken(user);
      const newRefreshToken = generateRefreshToken(user.id);

      await storedToken.update({
        token: newRefreshToken,
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
      });
      await cleanupExpiredRefreshTokens();

      res.json(
        ApiResponse.success({
          access_token: newAccessToken,
          refresh_token: newRefreshToken,
        })
      );
    } catch (e) {
      console.error(e);
      if (e.name === "JsonWebTokenError" || e.name === "TokenExpiredError") {
        await RefreshToken.destroy({ where: { token: refreshToken } });
        return res.status(403).json(ApiResponse.error("Невалидный токен", 403));
      }
      res.status(500).json(ApiResponse.error("Ошибка сервера", 500));
    }
  }

  /** Проверяет учётные данные и выдаёт пару токенов */
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

      await cleanupExpiredRefreshTokens();
      const accessToken = generateAccessToken(user);
      const refreshToken = await createRefreshToken(user.id);

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

  /** Создаёт пользователя, личное пространство и пару токенов */
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

      await cleanupExpiredRefreshTokens();
      const access_token = generateAccessToken(user);
      const refresh_token = await createRefreshToken(user.id);

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

  /** Возвращает пользователя из проверенного access-токена */
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

  /** Отзывает все refresh-токены текущего пользователя */
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

  /** Возвращает всех пользователей, кроме текущего */
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
