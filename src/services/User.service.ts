import {User, UserModel, UserSchema} from "../schema/User.schema";
import * as mongoose from "mongoose";

export class UserService {
    schema: UserModel

    constructor() {
        this.schema = User
    }

    getById = async (id: string) => {
        return this.schema.findOne({_id: id})
    }
}

export const userService = new UserService()