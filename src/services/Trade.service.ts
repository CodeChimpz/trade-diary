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
        const updated = await (payload.closedManually ? this.calcClosedManually(trade, payload) : this.calcClosedScenario(trade, payload))
        const saved = await this.schema.findOneAndUpdate({_id: tradeId}, updated)
        console.log('updated',updated)
        return this.schema.findById(tradeId)
    }

    private calcClosedManually(trade: ITrade, payload: TradeUpdateData): Partial<ITrade> {
        return CalcService.calcClosedManually(trade, payload.resultPrice || 0)
    }

    private calcClosedScenario(trade: ITrade, payload: TradeUpdateData): Partial<ITrade> {
        if (payload.scenario !== TradeEnums.Scenarios.Stop) {
            return CalcService.calcSuccessScenario(trade, payload.scenario)
        }
        return CalcService.calcFailure(trade)
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
        data.profit = CalcService.getProfit(data,false).value
        return data
    }

    private formatTradePayload = (data: ITrade) => {
        return data
    }
}

export const tradeService = new TradeService(userService)