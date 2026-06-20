import { validationResult } from "express-validator";
import ApiResponse from "../utils/apiResponse.js";
import UserSpaces from "../models/userSpaces.js";
import Memory from "../models/memory.js";
import Space from "../models/space.js";
import { Op } from "sequelize";
const getMonth = (date) => {
    const month = new Date(date).getMonth() + 1;
    return month;
};
class spaceController {
    async getSpaceMemories(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(400)
                    .json(ApiResponse.error(errors.array()[0].msg, 400));
            }
            const { spaceId } = req.query;
            const year = req.query.year || new Date().getFullYear();
            const userId = req.user?.id;
            if (!spaceId) {
                return res
                    .status(400)
                    .json(ApiResponse.error("Не указано пространство", 400));
            }
            if (!userId) {
                return res
                    .status(401)
                    .json(ApiResponse.error("Пользователь не авторизован", 401));
            }
            const findedUserSpaces = await UserSpaces.findAll({
                where: { userId, spaceId },
            });
            // Проверка на наличие доступа к пространству
            let hasAccess = false;
            if (Array.isArray(findedUserSpaces)) {
                hasAccess = findedUserSpaces.some((el) => el.userId == userId && el.spaceId == spaceId);
            }
            else {
                hasAccess =
                    findedUserSpaces.userId == userId &&
                        findedUserSpaces.spaceId == spaceId;
            }
            if (!hasAccess) {
                return res
                    .status(403)
                    .json(ApiResponse.error("У вас нет доступа к этому пространству", 403));
            }
            const whereClause = { spaceId };
            whereClause.date = {
                [Op.between]: [
                    new Date(`${year}-01-01T00:00:00.000Z`),
                    new Date(`${year}-12-31T23:59:59.999Z`),
                ],
            };
            const memoriesByMonth = {};
            const memories = await Memory.findAll({ where: whereClause });
            if (memories.length) {
                memories.forEach((memory) => {
                    const month = getMonth(memory.date);
                    if (!memoriesByMonth[month]) {
                        memoriesByMonth[month] = [];
                    }
                    memoriesByMonth[month].push(memory);
                });
                return res
                    .status(200)
                    .json(ApiResponse.success({ ...memoriesByMonth }, 200));
            }
            else
                return res
                    .status(404)
                    .json(ApiResponse.error("Не найдено воспоминаний", 404));
        }
        catch (e) {
            res.status(500).json(ApiResponse.error("Ошибка сервера", 500));
            console.log(e);
        }
    }
    async createMemory(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(400)
                    .json(ApiResponse.error(errors.array()[0].msg, 400));
            }
            const { spaceId, name, description, photo, date } = req.body;
            const userId = req.user.id;
            if (!spaceId || !name || !date) {
                return res
                    .status(400)
                    .json(ApiResponse.error("Заполните все поля", 400));
            }
            const spaceExists = await Space.findByPk(spaceId);
            if (!spaceExists) {
                return res
                    .status(404)
                    .json(ApiResponse.error("Пространство не найдено", 404));
            }
            const thisDateMemory = await Memory.findOne({ where: { date, spaceId } });
            if (thisDateMemory) {
                return res
                    .status(400)
                    .json(ApiResponse.error("На эту дату уже есть воспоминание", 400));
            }
            const memory = await Memory.create({
                userId,
                spaceId,
                name,
                description,
                date,
                photo,
            });
            res.status(201).json(ApiResponse.success({ ...memory.dataValues }, 201));
        }
        catch (e) {
            res.status(500).json(ApiResponse.error("Ошибка сервера", 500));
            console.log(e);
        }
    }
}
export default new spaceController();
