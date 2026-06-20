import { validationResult } from "express-validator";
import compressImage from "../utils/compressImage.js";
import ApiResponse from "../utils/apiResponse.js";
import crypto from "crypto";
import path from "path";
import fs from "fs";
class filesController {
    async uploadPhoto(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(400)
                    .json(ApiResponse.error(errors.array()[0].msg, 400));
            }
            const imageBuffer = req.file.buffer;
            const width = 280 * 2;
            const height = 280 * 2;
            const compressedImageBuffer = await compressImage(imageBuffer, width, height);
            const hash = crypto.randomBytes(20).toString("hex");
            const ext = path.extname(req.file.originalname);
            // Сохраняем сжатый файл на диск
            const filePath = path.join("uploads", hash + ext);
            fs.writeFileSync(filePath, compressedImageBuffer);
            res.status(201).json(ApiResponse.success({ file: hash + ext, }, 201));
        }
        catch (error) {
            console.log(error);
            res.status(500).json(ApiResponse.error("Server error", 500));
            return res
                .status(500)
                .json(ApiResponse.error({ message: "Server error" }, 500));
        }
    }
}
export default new filesController();
