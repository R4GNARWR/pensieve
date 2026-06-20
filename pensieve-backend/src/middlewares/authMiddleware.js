import jsonwebtoken from "jsonwebtoken";
const { verify } = jsonwebtoken;

export default async function (req, res, next) {
  if (req.method === "OPTIONS") {
    return next();
  }
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(403).json({ message: "Пользователь не авторизован" });
    }
    const decodeData = verify(token, process.env.SECRET_KEY);
    if (decodeData.id && decodeData.username && decodeData.name) {
      req.user = decodeData;
    } else {
      return res.status(500).json({ message: "Ошибка авторизации" });
    }
    return next();
  } catch (e) {
    console.log(e);
    return res.status(403).json({ message: "Пользователь не авторизован" });
  }
}
