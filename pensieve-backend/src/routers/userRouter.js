import express from "express";
import { body } from "express-validator";
import userController from "../controllers/userController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import emailValidation from "../middlewares/emailValidation.js";

const router = express.Router();

const usernameValidation = body("username")
    .optional()
    .isString()
    .withMessage("Имя пользователя должно быть строкой")
    .bail()
  .trim()
  .escape()
  .custom((value) => {
      if (value.length < 3 || value.length > 30)
          throw new Error("Имя пользователя должно содержать от 3 до 30 символов");
    if (!/^[a-zA-Z0-9_-]+$/.test(value))
        throw new Error("Имя пользователя может содержать только латинские буквы, цифры, дефис и подчёркивание");
    return true;
  });

/**
 * @swagger
 * components:
 *   schemas:
 *     SessionUser:
 *       type: object
 *       required: [id, name, email, username]
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         username:
 *           type: [string, 'null']
 *     AuthResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         data:
 *           type: object
 *           required: [user, access_token, refresh_token]
 *           properties:
 *             user:
 *               $ref: '#/components/schemas/SessionUser'
 *             access_token:
 *               type: string
 *             refresh_token:
 *               type: string
 *         meta:
 *           type: object
 */

/**
 * @swagger
 *
 * /register:
 *   post:
 *     tags:
 *       - Users
 *     description: Создаёт аккаунт и личное пространство. Email становится логином. Пробелы по краям удаляются, адрес приводится к нижнему регистру.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 maxLength: 254
 *               username:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 30
 *                 pattern: '^[a-zA-Z0-9_-]+$'
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 40
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 maxLength: 40
 *     responses:
 *       201:
 *         description: Пользователь успешно зарегистрирован
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Ошибки валидации
 *       403:
 *         description: Регистрация закрыта
 *       409:
 *         description: Email или имя пользователя уже используется
 */
router.post(
  "/register",
  [
      emailValidation,
    usernameValidation,
    body("name")
        .isString()
        .withMessage("Имя должно быть строкой")
        .bail()
      .trim()
      .escape()
      .custom((value) => {
        if (!value) throw new Error("Поле 'Имя' не может быть пустым");
        if (value.length < 2) throw new Error("Имя должно быть не менее 2 символов");
        if (value.length > 40) throw new Error("Имя должно быть не более 40 символов");
        return true;
      }),
    body("password")
        .isString()
        .withMessage("Пароль должен быть строкой")
        .bail()
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
 *     description: Вход по email и паролю. Для email применяется та же нормализация, что и при регистрации.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 maxLength: 254
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Пользователь аутентифицирован
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Ошибки валидации или неверный пароль
 *       404:
 *         description: Пользователь с таким email не найден
 */
router.post(
  "/login",
  [
      emailValidation,
    body("password")
        .isString()
        .withMessage("Пароль должен быть строкой")
        .bail()
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
 *         description: Данные текущего пользователя с email и необязательным username
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
 *               refresh_token:
 *                 type: string
 *     responses:
 *       200:
 *         description: Новая пара токенов
 *       403:
 *         description: Токен невалидный или истёк
 */
router.post("/refresh", userController.refreshToken);

export default router;
