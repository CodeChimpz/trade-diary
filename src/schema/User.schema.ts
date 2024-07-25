import {Schema, model} from 'mongoose';
import * as mongoose from "mongoose";

export interface IUser {
    _id: string,
    email: string,
    password: string,
    name: string,
    initialDeposit: number,
    currentDeposit: number,
    dateCreated: Date
}

export const UserSchema = new Schema<IUser>({
    email: {
        type: String,
        required: true,
        unique: true,
        match: /.+\@.+\..+/,
    },
    password: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    initialDeposit: {
        type: Number,
        required: true,
        min: 0,
    },
    currentDeposit: {
        type: Number,
        required: true,
        min: 0,
    },
    dateCreated: {
        type: Date,
        default: Date.now
    },
});

export type UserModel = mongoose.Model<IUser>

export const User = model<IUser>('User', UserSchema);