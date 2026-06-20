import Space from "../models/space.js";
import User from "../models/user.js";
import UserSpaces from "../models/userSpaces.js";
import ApiResponse from "../utils/apiResponse.js";
import { validationResult } from "express-validator";
import SpaceService from "../services/space-service.js";
class spaceController {
    async getSpaces(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(400)
                    .json(ApiResponse.error(errors.array()[0].msg, 400));
            }
            const userId = req.user?.id;
            const userSpaces = await UserSpaces.findAll({
                where: { userId: userId },
            });
            if (userSpaces) {
                const spaces = [];
                if (Array.isArray(userSpaces)) {
                    for (const space of userSpaces) {
                        const spaceFinded = await Space.findByPk(space.spaceId);
                        spaces.push(spaceFinded);
                    }
                }
                else {
                    const spaceFinded = await Space.findByPk(userSpaces.spaceId);
                    spaces.push(spaceFinded);
                }
                if (spaces.length) {
                    return res.status(200).json(ApiResponse.success([...spaces]));
                }
                else {
                    return res
                        .status(404)
                        .json(ApiResponse.error("Не найдено пространств", 404));
                }
            }
            else {
                return res
                    .status(404)
                    .json(ApiResponse.error("Не найдено пространств", 404));
            }
        }
        catch (e) {
            res.status(500).json(ApiResponse.error("Ошибка сервера", 500));
            console.log(e);
        }
    }
    async createSpace(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(400)
                    .json(ApiResponse.error(errors.array()[0].msg, 400));
            }
            const spaceResult = await SpaceService.createUserSpace(req.user.id, req.body.name);
            return res.status(201).json(ApiResponse.success({ ...spaceResult }, 201));
        }
        catch (e) {
            res.status(500).json(ApiResponse.error("Ошибка сервера", 500));
            console.log(e);
        }
    }
    async addUserToSpace(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(400)
                    .json(ApiResponse.error(errors.array()[0].msg, 400));
            }
            const { spaceId, email } = req.body;
            const space = await Space.findByPk(spaceId);
            if (!space) {
                return res
                    .status(404)
                    .json(ApiResponse.error("Пространство не найдено", 404));
            }
            const userToAdd = await User.findOne({ where: { email } });
            if (!userToAdd) {
                return res
                    .status(404)
                    .json(ApiResponse.error("Пользователь не найден", 404));
            }
            await UserSpaces.create({ userId: userToAdd.id, spaceId: space.id });
            await space.save();
            return res
                .status(200)
                .json(ApiResponse.success("Пользователь добавлен", 200));
        }
        catch (e) {
            res.status(500).json(ApiResponse.error("Ошибка сервера", 500));
            console.log(e);
        }
    }
}
export default new spaceController();
