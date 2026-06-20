import express from "express";
import { body } from "express-validator";
import userController from "../controllers/userController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

const usernameValidation = body("username")
  .trim()
  .escape()
  .custom((value) => {
    if (!value) throw new Error("Поле 'Логин' не может быть пустым");
    if (value.length < 3) throw new Error("Логин должен быть не менее 3 символов");
    if (value.length > 30) throw new Error("Логин должен быть не более 30 символов");
    if (!/^[a-zA-Z0-9_-]+$/.test(value))
      throw new Error("Логин может содержать только буквы, цифры, дефис и подчёркивание");
    return true;
  });

/**
 * @swagger
 *
 * /register:
 *   post:
 *     tags:
 *       - Users
 *     description: Регистрация нового пользователя
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               name:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Пользователь успешно зарегистрирован
 *       400:
 *         description: Ошибки валидации
 *       403:
 *         description: Регистрация закрыта
 */
router.post(
  "/register",
  [
    usernameValidation,
    body("name")
      .trim()
      .escape()
      .custom((value) => {
        if (!value) throw new Error("Поле 'Имя' не может быть пустым");
        if (value.length < 2) throw new Error("Имя должно быть не менее 2 символов");
        if (value.length > 40) throw new Error("Имя должно быть не более 40 символов");
        return true;
      }),
    body("password")
      .trim()
      .escape()
      .custom((value) => {
        if (!value) throw new Error("Поле 'Пароль' не может быть пустым");
        if (value.length < 8) throw new Error("Пароль должен быть не менее 8 символов");
        if (value.length > 40) throw new Error("Пароль должен быть не более 40 символов");
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
 *     description: Аутентификация пользователя
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Пользователь аутентифицирован
 *       400:
 *         description: Ошибки валидации
 */
router.post(
  "/login",
  [
    usernameValidation,
    body("password")
      .trim()
      .escape()
      .custom((value) => {
        if (!value) throw new Error("Поле 'Пароль' не может быть пустым");
        return true;
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
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Успешная авторизация
 *       403:
 *         description: Пользователь не авторизован
 */
router.get("/authorize", authMiddleware, userController.authorize);

/**
 * @swagger
 *
 * /logout:
 *   get:
 *     tags:
 *       - Users
 *     summary: Выход из системы
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Успешный выход
 *       403:
 *         description: Пользователь не авторизован
 */
router.get("/logout", authMiddleware, userController.logout);

/**
 * @swagger
 *
 * /refresh:
 *   post:
 *     tags:
 *       - Users
 *     summary: Обновление access токена
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
 *       403:
 *         description: Токен невалидный или истёк
 */
router.post("/refresh", userController.refreshToken);

/**
 * @swagger
 *
 * /users:
 *   get:
 *     tags:
 *       - Users
 *     summary: Список всех пользователей приложения
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Массив пользователей (id, username, name)
 *       403:
 *         description: Пользователь не авторизован
 */
router.get("/users", authMiddleware, userController.getUsers);

export default router;
