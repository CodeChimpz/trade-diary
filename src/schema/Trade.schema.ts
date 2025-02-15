import * as mongoose from 'mongoose';
import {Schema, model} from 'mongoose';
import {IUser} from "./User.schema";
import {TradeEnums} from "../types/trade.types";
import {ObjectId} from "mongodb";

export interface ITrade {
    _id: string,
    ticker: 'BTC/USDT' | 'ETH/USDT',
    position: 'Long' | 'Short',
    trend: 'Up' | 'Down',
    order: 'Limit' | 'Market',
    enter: number,
    stop: number,
    firstTakePrice: string,
    secondTakePrice?: string,
    thirdTakePrice?: string,
    riskPercent: 0.5 | 1 | 2 | 3,
    lost: number | null,
    profit: number | null,
    depositBefore: number,
    quantity: number,
    depositAfter: number | null,
    resultValue: number | null,
    resultPrice: number | null,
    result: string,
    closedManually: boolean,
    closeScenario: TradeEnums.Scenarios | null,
    createdBy: Partial<IUser>,
    dateCreated: Date
}

export type ITrade_ID = Document  & ITrade & { _id: string }

export const TradeSchema = new Schema<ITrade>({
    ticker: {
        minLength: 5,
        maxLength: 15,
        type: String,
        enum: ['BTC/USDT', 'ETH/USDT'],
        default: 'BTC/USDT',
        required: true,
        trim: true,
    },
    position: {
        minLength: 4,
        maxLength: 5,
        type: String,
        enum: ['Long', 'Short'],
        default: 'Long',
        required: true,
        trim: true,
    },
    trend: {
        minLength: 2,
        maxLength: 4,
        type: String,
        enum: ['Up', 'Down'],
        default: 'Up',
        required: true,
        trim: true,
    },
    order: {
        minLength: 5,
        maxLength: 6,
        type: String,
        enum: ['Limit', 'Market'],
        default: 'Limit',
        required: true,
        trim: true,
    },
    enter: {
        type: Number,
        min: 0.01,
        max: 100000,
        required: true,
    },
    stop: {
        type: Number,
        min: 0.01,
        max: 100000,
        required: true,
    },
    firstTakePrice: {
        minLength: 7,
        maxLength: 100,
        type: String,
        required: true,
        trim: true,
        match: /^[0-9]* \/ [0-9]{2,3}%*$/,
    },
    secondTakePrice: {
        minLength: 7,
        maxLength: 100,
        type: String,
        nullable: true,
        trim: true,
        match: /^[0-9]* \/ [0-9]{2}%*$/,
    },
    thirdTakePrice: {
        minLength: 7,
        maxLength: 100,
        type: String,
        nullable: true,
        trim: true,
        match: /^[0-9]* \/ [0-9]{2}%*$/,
    },
    closeScenario: {
        minLength: 5,
        maxLength: 6,
        type: String,
        enum: ['First', 'Second', 'Third', 'Stop'],
        nullable: true,
        required: false,
        trim: true,
    },
    riskPercent: {
        type: Number,
        enum: [0.5, 1, 2, 3],
        default: 1,
        required: true,
    },
    lost: {
        type: Number,
        required: false,
    },
    profit: {
        type: Number,
        required: false,
    },
    depositBefore: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: false,
    },
    depositAfter: {
        type: Number,
        required: false,
        nullable: true,
    },
    resultValue: {
        type: Number,
        nullable: true,
    },
    resultPrice: {
        type: Number,
        nullable: true,
    },
    result: {
        type: String,
        minLength: 7,
        maxLength: 8,
        enum: ['Success', 'Failure', 'Process', 'PartiallyClosed'],
        default: 'Process',
        trim: true,
    },
    closedManually: {
        type: Boolean,
        default: false,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    dateCreated: {
        type: Date,
        default: Date.now
    },
});


export const Trade = model<ITrade>('Trade', TradeSchema);
export type TradeModel = typeof Trade
