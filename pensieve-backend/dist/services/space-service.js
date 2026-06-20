import Space from "../models/space.js";
import UserSpaces from "../models/userSpaces.js";
export default class SpaceService {
    static async createUserSpace(userId, spaceName) {
        const space = await Space.create({
            name: spaceName,
            ownerId: userId,
        });
        await UserSpaces.create({ userId, spaceId: space.id });
        return {
            id: space.id,
            name: space.name
        };
    }
}
