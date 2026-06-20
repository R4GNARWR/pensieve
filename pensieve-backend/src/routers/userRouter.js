import express from "express";
import { body } from "express-validator";
import * as EmailValidator from "email-validator";
import userController from "../controllers/userController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 *
 * /register:
 *   post:
 *     tags:
 *       - Users
 *     produces:
 *       - application/json
 *     description: Регистрация нового пользователя
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Пользователь успешно зарегистрирован
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *       400:
 *         description: Ошибки валидации
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 */
router.post(
  "/register",
  [
    body("name")
      .trim()
      .escape()
      .custom((value) => {
        if (!value) {
          throw new Error("Поле 'Имя' не может быть пустым");
        }
        if (value.length < 2) {
          throw new Error("Имя должно быть не менее 2 символов");
        }
        if (value.length > 40) {
          throw new Error("Имя должно быть не более 40 символов");
        }
        return true;
      }),
    body("email")
      .trim()
      .escape()
      .custom(async (value) => {
        if (!value) {
          throw new Error("Поле 'Email' не может быть пустым");
        }
        if (!EmailValidator.validate(value)) {
          throw new Error("Некорректный email");
        }
        return true;
      }),
    body("password")
      .trim()
      .escape()
      .custom((value) => {
        if (!value) {
          throw new Error("Поле 'Пароль' не может быть пустым");
        }
        if (value.length < 8) {
          throw new Error("Пароль должен быть не менее 8 символов");
        }
        if (value.length > 40) {
          throw new Error("Пароль должен быть не более 40 символов");
        }
        return true;
      }),
  ],
  userController.register
);
/**
 * @swagger
 *
 * /login:
 *   post:
 *     tags:
 *       - Users
 *     produces:
 *       - application/json
 *     description: Аутентификация пользователя
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Пользователь аутентифицирован
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *       400:
 *         description: Ошибки валидации
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 */
router.post(
  "/login",
  [
    body("email")
      .trim()
      .escape()
      .custom(async (value) => {
        if (!value) {
          throw new Error("Поле 'Email' не может быть пустым");
        }
        if(!EmailValidator.validate(value)) {
          throw new Error("Некорректный email");
        }
      }),
    body("password")
      .trim()
      .escape()
      .custom(async (value) => {
        if (!value) {
          throw new Error("Поле 'Пароль' не может быть пустым");
        }
      }),
  ],
  userController.login
);
/**
 * @swagger
 *
 * /authorize:
 *   get:
 *     tags:
 *       - Users
 *     summary: Проверка авторизации пользователя
 *     description: Возвращает информацию о текущем аутентифицированном пользователе
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Успешная авторизация
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: "Иван Иванов"
 *                 email:
 *                   type: string
 *                   example: "user@example.com"
 *       401:
 *         description: Пользователь не авторизован
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Ошибка сервера"
 *       500:
 *         description: Ошибка сервера
 */
router.get(
  "/authorize", authMiddleware, userController.authorize
);
/**
 * @swagger
 *
 * /logout:
 *   get:
 *     tags:
 *       - Users
 *     summary: Выход из системы
 *     description: Завершает текущую сессию пользователя и удаляет refresh-токен
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Успешный выход
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Вы успешно вышли"
 *       401:
 *         description: Пользователь не авторизован
 *       500:
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Ошибка сервера"
 */
router.get(
  "/logout", authMiddleware, userController.logout
);

/**
 * @swagger
 *
 * /refresh:
 *   post:
 *     tags:
 *       - Users
 *     summary: Обновление access токена
 *     description: Выдаёт новую пару токенов по действующему refresh токену
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Новая пара токенов
 *       401:
 *         description: Токен отсутствует
 *       403:
 *         description: Токен невалидный или истёк
 */
router.post("/refresh", userController.refreshToken);

export default router;
