import Space from "../models/space.js";
import UserSpaces from "../models/userSpaces.js";

export default class SpaceService {
  static async createUserSpace(userId, spaceName, transaction) {
    const space = await Space.create({name: spaceName, ownerId: userId}, {transaction});

    await UserSpaces.create({userId, spaceId: space.id}, {transaction});
    return {
      id: space.id,
      name: space.name
    };
  }
}
