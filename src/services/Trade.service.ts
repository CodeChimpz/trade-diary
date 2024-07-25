import {ITrade, Trade, TradeModel} from "../schema/Trade.schema";
import {userService, UserService} from "./User.service";
import {TradeRequestData, TradeUpdateData} from "../types/request";
import {IUser} from "../schema/User.schema";
import {CalcService} from "../util/Calc.service";
import {TradeEnums} from "../types/trade.types";

export class TradeService {
    schema: TradeModel
    userService: UserService

    constructor(userService: UserService) {
        this.schema = Trade
        this.userService = userService
    }

    getTrades = async (userId: string,) => {
        const results = await this.schema.find({
            createdBy: {
                _id: userId
            }
        })
        return results.map(row =>
            this.formatTradePayload(row))
    }

    deleteTrade = async (tradeId: string,) => {
        return this.schema.findOneAndDelete({_id: tradeId})
    }

    editTrade = async (tradeId: string, payload: TradeUpdateData) => {
        const trade = await this.schema.findById(tradeId)
        if (!trade || trade.result !== TradeEnums.Results.Process) {
            return null
        }
        const {result, resultValue, closedManually} = payload
        trade.result = result
        trade.resultValue = resultValue
        trade.closedManually = closedManually
        const calculated = CalcService.calcClosedTrade(trade)
        trade.resultValue = calculated.resultValue
        trade.depositAfter = calculated.depositAfter
        const updated = await trade.save()
        return this.formatTradePayload(updated)
    }


    postTrade = async (userId: string, payload: TradeRequestData) => {
        const user = await this.userService.getById(userId)
        if (!user) {
            return null
        }
        const data = this.createTradePayload(payload, user)
        const created = await this.schema.create(data)
        return this.formatTradePayload(created)
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

    private formatTradePayload = (data: ITrade) => {
        return data
    }
}

export const tradeService = new TradeService(userService)