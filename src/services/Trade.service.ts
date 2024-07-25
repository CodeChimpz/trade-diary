import {ITrade, Trade, TradeModel} from "../schema/Trade.schema";
import {userService, UserService} from "./User.service";
import {TradeRequestData} from "../types/request";
import {IUser} from "../schema/User.schema";
import {CalcService} from "../util/Calc.service";

export class TradeService {
    schema: TradeModel
    userService: UserService

    constructor(userService: UserService) {
        this.schema = Trade
        this.userService = userService
    }

    getTrades = async () => {

    }

    getTrade = async () => {

    }

    postTrade = async (userId: string, payload: TradeRequestData) => {
        const user = await this.userService.getById(userId)
        if (!user) {
            return null
        }
        const data = this.createTradePayload(payload, user)
        const created = await this.schema.create(data)
        return this.processTradePayload(created)
    }

    private createTradePayload = (payload: TradeRequestData, userData: IUser): ITrade => {
        const data: ITrade = {
            ...payload,
            depositBefore: userData.currentDeposit || userData.initialDeposit,
            result: 'Process',
            createdBy: userData,
            dateCreated: new Date(),
            amount: 0,
            lost: 0,
            profit: 0
        }
        data.amount = CalcService.getTradeAmount(data)
        data.lost = CalcService.getLost(data)
        data.profit = CalcService.getProfit(data)
        return data
    }

    private processTradePayload = (data: ITrade) => {
        return data
    }
}

export const tradeService = new TradeService(userService)