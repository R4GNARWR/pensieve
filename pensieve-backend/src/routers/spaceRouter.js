import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
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
 *             properties:
 *               spaceId:
 *                 type: number
 *               userId:
 *                 type: number
 *     responses:
 *       200:
 *         description: Пользователь добавлен
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
    body("userId")
      .isInt({ min: 1 })
      .withMessage("userId должен быть числом"),
  ],
  async (req, res) => {
    spaceController.addUserToSpace(req, res);
  }
);

export default router;
