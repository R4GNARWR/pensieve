import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import emailValidation from "../middlewares/emailValidation.js";
import spaceController from "../controllers/spaceController.js";
import { body } from "express-validator";

const router = express.Router();

/**
 * @swagger
 *
 * /space:
 *   get:
 *     tags:
 *       - Space
 *     description: Получение списка пространств пользователя
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список пространств
 */
router.get("/space", authMiddleware, async (req, res) => {
  spaceController.getSpaces(req, res);
});

/**
 * @swagger
 *
 * /space:
 *   post:
 *     tags:
 *       - Space
 *     description: Создание нового пространства
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Пространство успешно создано
 */
router.post(
  "/space",
  authMiddleware,
  [
    body("name")
      .trim()
      .escape()
      .custom((value) => {
        if (!value) throw new Error("Поле 'Имя' не может быть пустым");
        if (value.length < 3) throw new Error("Имя должно быть не менее 3 символов");
        if (value.length > 40) throw new Error("Имя должно быть не более 40 символов");
        return true;
      }),
  ],
  async (req, res) => {
    spaceController.createSpace(req, res);
  }
);

/**
 * @swagger
 *
 * /space/add:
 *   post:
 *     tags:
 *       - Space
 *     description: Добавление пользователя в пространство (только для владельца)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [spaceId, email]
 *             properties:
 *               spaceId:
 *                 type: integer
 *                 minimum: 1
 *               email:
 *                 type: string
 *                 format: email
 *                 maxLength: 254
 *     responses:
 *       200:
 *         description: Пользователь добавлен
 *       400:
 *         description: Ошибка валидации или пользователь уже состоит в пространстве
 *       403:
 *         description: Нет прав (не владелец)
 *       404:
 *         description: Пространство или пользователь не найден
 */
router.post(
  "/space/add",
  authMiddleware,
  [
    body("spaceId")
      .isInt({ min: 1 })
      .withMessage("spaceId должен быть числом"),
      emailValidation,
  ],
  async (req, res) => {
    spaceController.addUserToSpace(req, res);
  }
);

export default router;
