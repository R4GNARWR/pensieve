import authMiddleware from "../middlewares/authMiddleware.js";
import filesController from "../controllers/filesController.js";
import { fileTypeFromBuffer } from "file-type";
import { body } from "express-validator";
import express from "express";
import multer from "multer";

// Обработчик ошибок для Multer
const multerErrorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res
        .status(400)
        .json({ error: "Файл слишком большой. Максимальный размер 5MB." });
    }
    return res.status(400).json({ error: err.message });
  }
  next(err);
};

// Multer конфиг
const multerConfig = {
  dest: "uploads/", // Папка для сохранения файлов
  limits: { fileSize: 5 * 1024 * 1024 }, // Максимальный размер файла (5MB)
  storage: multer.memoryStorage(),
};

const upload = multer(multerConfig);
const router = express.Router();

router.post(
  "/photo",
  authMiddleware,
  upload.single("photo"),
  multerErrorHandler,
  body("file").custom(async (value, { req }) => {
    if (!req.file.buffer) {
      throw new Error("Файл обязателен для загрузки.");
    }
    const type = await fileTypeFromBuffer(req.file.buffer);
    if (!type || (type.mime !== "image/jpeg" && type.mime !== "image/png")) {
      throw new Error("Неверный тип файла.");
    }
    return true;
  }),
  async (req, res) => {
    filesController.uploadPhoto(req, res);
  }
);

export default router;
