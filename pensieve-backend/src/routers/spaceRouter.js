import express from "express";
import * as EmailValidator from "email-validator";
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
 *     produces:
 *       - application/json
 *     description: Получение списка пространств
 *     responses:
 *       200:
 *         description: Список пространств
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: number
 *                   name:
 *                     type: string
 *                   ownerId:
 *                     type: number
 *         400:
 *           description: Ошибка при получении
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 */
router.get("/space", authMiddleware, async (req, res) => {
  spaceController.getSpaces(req, res);
});

/**
 * @swagger
 *
 * /space:
 *  post:
 *    tags:
 *      - Space
 *    produces:
 *      - application/json
 *    description: Создание нового пространства
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *    responses:
 *      201:
 *        description: Пространство успешно создано
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                id:
 *                  type: number
 *                name:
 *                  type: string
 *
 *      400:
 *        description: Ошибка при создании
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *  */
router.post("/space",
  authMiddleware,
  [
    body("name")
      .trim()
      .escape()
      .custom((value) => {
        if (!value) {
          throw new Error("Поле 'Имя' не может быть пустым");
        }
        if (value.length < 3) {
          throw new Error("Имя должно быть не менее 2 символов");
        }
        if (value.length > 40) {
          throw new Error("Имя должно быть не более 40 символов");
        }
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
 *  post:
 *    tags:
 *      - Space
 *    produces:
 *      - application/json
 *    description: Добавление пользователя в пространство
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              spaceId:
 *                type: number
 *              email:
 *                type: string
 *    responses:
 *      201:
 *        description: Пространство успешно создано
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                id:
 *                  type: number
 *                name:
 *                  type: string
 *
 *      400:
 *        description: Ошибка при создании
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *  */
router.post("/space/add",
  authMiddleware,
  [
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
  ],
  async (req, res) => {
    spaceController.addUserToSpace(req, res);
  }
);

export default router;
