import authMiddleware from "../middlewares/authMiddleware.js";
import memoryController from "../controllers/memoryController.js";
import { body, query } from "express-validator";
import express from "express";
const router = express.Router();
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
router.get("/memory", authMiddleware, [
    query("year")
        .trim()
        .isInt({ min: 1900, max: new Date().getFullYear() })
        .withMessage("Неправильный год. Должно быть число от 1900 до текущего года")
        .toInt(),
], async (req, res) => {
    memoryController.getSpaceMemories(req, res);
});
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
router.post("/memory", authMiddleware, [
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
        .trim()
        .escape()
        .custom((value) => {
        if (!value) {
            throw new Error("Поле 'Дата' не может быть пустым");
        }
        const currentYear = new Date().getFullYear();
        if (new Date(value).getFullYear() < currentYear) {
            throw new Error("Нельзя добавить воспоминание не текущего года!");
        }
        return true;
    }),
    body("photo").trim().escape(),
], async (req, res) => {
    memoryController.createMemory(req, res);
});
export default router;
