import crypto from "crypto";
import User from "../models/user.js";
import jsonwebtoken from "jsonwebtoken";
import RefreshToken from "../models/refresh.js";
import ApiResponse from "../utils/apiResponse.js";
import { validationResult } from "express-validator";
import SpaceService from "../services/space-service.js";
const { sign, verify } = jsonwebtoken;
const generateAccessToken = (user) => {
    return sign({
        id: user.id,
        email: user.email,
        name: user.name,
        iss: "your-app-name",
        aud: "your-app-client",
    }, process.env.SECRET_KEY, { expiresIn: "24h" });
};
const generateRefreshToken = (id) => {
    return sign({ id }, process.env.REFRESH_SECRET_KEY, {
        expiresIn: "7d",
    });
};
const comparePasswords = (inputPass, storedPass, salt) => {
    const inputHash = crypto.scryptSync(inputPass, salt, 64);
    const storedHash = Buffer.from(storedPass, "base64");
    return (inputHash.length === storedHash.length &&
        crypto.timingSafeEqual(inputHash, storedHash));
};
class authController {
    async refreshToken(req, res) {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(401).json(ApiResponse.error("Токен отсутствует", 401));
        }
        try {
            // Проверяем наличие токена в базе
            const storedToken = await RefreshToken.findOne({
                where: { token: refreshToken },
                include: User,
            });
            if (!storedToken) {
                return res.status(403).json(ApiResponse.error("Невалидный токен"), 403);
            }
            // Проверяем срок действия
            if (new Date() > storedToken.expiresAt) {
                await storedToken.destroy();
                return res.status(403).json(ApiResponse.error("Токен истек", 403));
            }
            // Проверяем наличие пользователя
            if (!storedToken.User) {
                return res
                    .status(403)
                    .json(ApiResponse.error("Пользователь не найден", 403));
            }
            // Верифицируем токен
            // В refreshToken методе:
            const decoded = verify(refreshToken, process.env.REFRESH_SECRET_KEY, {
                issuer: "your-app-name",
                audience: "your-app-client",
            });
            if (decoded.id !== storedToken.User.id) {
                await storedToken.destroy();
                throw new AuthenticationError("Невалидный токен");
            }
            // Генерируем новые токены
            const newAccessToken = generateAccessToken(storedToken.User);
            const newRefreshToken = generateRefreshToken(storedToken.User.id);
            // Обновляем токен в базе
            await storedToken.update({
                token: newRefreshToken,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            });
            res.json(ApiResponse.success({
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
            }));
        }
        catch (e) {
            console.error(e);
            if (e.name === "JsonWebTokenError") {
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
            const { email } = req.body;
            const user = await User.findOne({ where: { email } });
            if (!user) {
                return res
                    .status(404)
                    .json(ApiResponse.error("Пользователь c таким email не найден", 404));
            }
            if (comparePasswords(req.body.password, user.password, user.salt) === false) {
                return res.status(400).json(ApiResponse.error("Неверный пароль", 400));
            }
            const accessToken = generateAccessToken(user);
            const refreshToken = generateRefreshToken(user.id);
            await RefreshToken.create({
                token: refreshToken,
                userId: user.id,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 дней
            });
            if (user) {
                res.json(ApiResponse.success({
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                    },
                    access_token: accessToken,
                    refresh_token: refreshToken,
                }));
            }
        }
        catch (e) {
            res.status(500).json(ApiResponse.error("Ошибка сервера", 500));
            console.log(e);
        }
    }
    async register(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json(ApiResponse.error(errors.array()[0].msg));
            }
            const { name, email, password } = req.body;
            const findExistingUser = await User.findOne({ where: { email: email } });
            if (findExistingUser) {
                return res
                    .status(400)
                    .json(ApiResponse.error("Пользователь с таким email уже существует", 400));
            }
            const salt = crypto.randomBytes(16).toString("base64");
            const dectyptedPassword = crypto
                .scryptSync(password, salt, 64)
                .toString("base64");
            const user = await User.create({
                name,
                email,
                password: dectyptedPassword,
                salt,
            });
            await SpaceService.createUserSpace(user.id, "Personal");
            const access_token = generateAccessToken(user.id, user.email, user.name);
            const refresh_token = generateRefreshToken(user.id);
            res.status(201).json(ApiResponse.success({
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                },
                access_token,
                refresh_token,
            }, 200));
        }
        catch (e) {
            res.status(500).json(ApiResponse.error("Ошибка сервера", 500));
            console.log(e);
        }
    }
    async authorize(req, res) {
        try {
            const user = {
                id: req.user?.id,
                email: req.user?.email,
                name: req.user?.name,
            };
            res.json(ApiResponse.success(user, 200));
        }
        catch (e) {
            res.status(500).json(ApiResponse.error("Ошибка сервера", 500));
            console.log(e);
        }
    }
    async logout(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json(ApiResponse.error(errors.array()[0].msg));
            }
            const { id } = req.user;
            await RefreshToken.destroy({
                where: { userId: id },
            });
            res.status(200).json(ApiResponse.success("Вы успешно вышли", 200));
        }
        catch (e) {
            console.error("Logout error:", e);
            res.status(500).json(ApiResponse.error("Ошибка сервера", 500));
        }
    }
}
export default new authController();
