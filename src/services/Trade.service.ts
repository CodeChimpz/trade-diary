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
        console.log('debug', tradeId)
        return this.schema.findOneAndDelete({_id: tradeId})
    }

    editTrade = async (tradeId: string, payload: TradeUpdateData) => {
        const trade = await this.schema.findById(tradeId)
        if (!trade || trade.result !== TradeEnums.Results.Process) {
            return null
        }
        let updated: Partial<ITrade> = {}
        if (payload.closedManually) {
            const calc = CalcService.calcClosedManually(trade, payload.resultPrice, payload?.resultValue)
            if (!calc) {
                return null
            }
            updated = calc
        } else {
            switch (payload.result) {
                case TradeEnums.Results.PartiallyClosed:
                    return this.calcPartialTake(trade, payload)
                case TradeEnums.Results.Success:
                    return CalcService.calcSuccess(trade, true)
                case TradeEnums.Results.Failure:
                    return CalcService.calcSuccess(trade, false)
            }
        }
        const result = {
            ...trade,
            ...updated,
            result: payload.result
        }
        const saved = await this.schema.findOneAndUpdate({_id: tradeId}, result)
        return saved ? this.formatTradePayload(saved) : null
    }

    private calcPartialTake(trade: ITrade, payload: TradeUpdateData) {
        trade.currentTake = payload.take
        return trade
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