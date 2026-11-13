import jsonwebtoken from "jsonwebtoken";
import ApiResponse from "../utils/apiResponse.js";
const { verify } = jsonwebtoken;

/** Проверяет access JWT и передаёт его данные следующим обработчикам через req.user */
export default async function (req, res, next) {
  if (req.method === "OPTIONS") {
    return next();
  }
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res
        .status(401)
        .json(ApiResponse.error("Пользователь не авторизован", 401));
    }
    const decodeData = verify(token, process.env.SECRET_KEY);
    if (decodeData.id && decodeData.username && decodeData.name) {
      req.user = decodeData;
    } else {
      return res.status(403).json(ApiResponse.error("Невалидный токен", 403));
    }
    return next();
  } catch (e) {
    if (e.name === "TokenExpiredError") {
      return res.status(401).json(ApiResponse.error("Токен истек", 401));
    }
    return res.status(403).json(ApiResponse.error("Невалидный токен", 403));
  }
}
