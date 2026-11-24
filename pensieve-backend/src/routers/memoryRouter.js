import authMiddleware from "../middlewares/authMiddleware.js";
import memoryController from "../controllers/memoryController.js";
import { body, query } from "express-validator";
import express from "express";

const router = express.Router();
const minMemoryYear = 2000;
const yearRangeMessage = `Укажите год от ${minMemoryYear} до текущего`;
const dateFormatMessage = "Укажите дату в формате ГГГГ-ММ-ДД";

const isMemoryYear = (year) =>
    year >= minMemoryYear && year <= new Date().getFullYear();

/**
 * @swagger
 *
 * /memory/{spaceId}:
 *   get:
 *     tags:
 *       - Memory
 *     produces:
 *       - application/json
 *     description: Получение списка воспоминаний
 *     responses:
 *       200:
 *         description: Список воспоминаний
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
 *                     description: Название воспоминания
 *                   description:
 *                     type: string
 *                     description: Описание воспоминания
 *                   date:
 *                     type: string
 *                     description: Дата
 *                   photo:
 *                     type: string
 *                     description: Ссылка на фото
 *                   spaceId:
 *                     type: number
 *                     description: ID пространства
 *                   userId:
 *                     type: number
 *                     description: ID создателя воспоминания
 */
router.get(
  "/memory",
  authMiddleware,
  [
    query("year")
      .trim()
        .isInt()
        .withMessage(yearRangeMessage)
        .bail()
        .custom((value) => isMemoryYear(Number(value)))
        .withMessage(yearRangeMessage)
      .toInt(),
  ],
  async (req, res) => {
    memoryController.getSpaceMemories(req, res);
  }
);

/**
 * @swagger
 *
 * /memory:
 *   post:
 *     tags:
 *       - Memory
 *     produces:
 *       - application/json
 *     description: Создание нового воспоминания
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *               photo:
 *                 type: string
 *     responses:
 *       201:
 *         description: Воспоминание успешно создано
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: number
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 date:
 *                   type: string
 *                 photo:
 *                   type: string
 *                 spaceId:
 *                   type: number
 *                 userId:
 *                   type: number
 *       400:
 *          description: Ошибка валидации
 *       401:
 *          description: Пользователь не авторизован
 */
router.post(
  "/memory",
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
    body("description")
      .trim()
      .escape()
      .custom((value) => {
        if (value && value.length < 3) {
          throw new Error("Описание должно быть не менее 3 символов");
        }
        if (value && value.length > 1000) {
          throw new Error("Описание должно быть не более 1000 символов");
        }
        return true;
      }),
    body("date")
        .isString()
        .withMessage(dateFormatMessage)
        .bail()
      .trim()
        .notEmpty()
        .withMessage("Поле 'Дата' не может быть пустым")
        .bail()
        .matches(/^\d{4}-\d{2}-\d{2}$/)
        .withMessage(dateFormatMessage)
        .bail()
        .isISO8601({strict: true})
        .withMessage("Укажите существующую дату")
        .bail()
        .custom((date) => isMemoryYear(Number(date.slice(0, 4))))
        .withMessage(yearRangeMessage),
    body("photo").trim().escape(),
  ],
  async (req, res) => {
    memoryController.createMemory(req, res);
  }
);

export default router;
