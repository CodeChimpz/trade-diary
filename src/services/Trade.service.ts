import {ITrade, ITrade_ID, Trade, TradeModel} from "../schema/Trade.schema";
import {userService, UserService} from "./User.service";
import {TradeRequestData, TradeUpdateData} from "../types/request.types";
import {IUser} from "../schema/User.schema";
import {CalcService} from "../util/Calc.service";
import {TradeEnums} from "../types/trade.types";
import {TradeResponse} from "../types/response.types";

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
        const updated = await (!payload.scenario ? this.calcClosedManually(trade, payload) : this.calcClosedScenario(trade, payload))
        await this.schema.findOneAndUpdate({_id: tradeId}, updated)
        const saved = await this.schema.findById(tradeId)
        return saved ? this.formatTradePayload(saved) : null
    }

    private calcClosedManually(trade: ITrade, payload: TradeUpdateData): Partial<ITrade> {
        return CalcService.calcClosedManually(trade, payload.resultPrice || 0)
    }

    private calcClosedScenario(trade: ITrade, payload: TradeUpdateData): Partial<ITrade> {
        if (payload.scenario !== TradeEnums.Scenarios.Stop) {
            return CalcService.calcSuccessScenario(trade, payload.scenario || null)
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
    //TODO: Trade format service
    private createTradePayload = (payload: TradeRequestData, userData: IUser): ITrade => {
        const data: Partial<ITrade> = {
            ...payload,
            depositBefore: userData.currentDeposit || userData.initialDeposit,
            result: 'Process',
            createdBy: userData,
            dateCreated: new Date(),
            quantity: 0,
            lost: 0,
            profit: 0,
            closeScenario: null,
            closedManually: false,
            depositAfter: null,
            resultPrice: null,
            resultValue: null,
        }
        const dataCast = data as ITrade
        data.quantity = CalcService.getTradeAmount(dataCast)
        data.lost = CalcService.getLost(dataCast).value
        data.profit = CalcService.getProfit(dataCast, false, null).value
        return dataCast
    }

    private formatTradePayload = (data: ITrade): TradeResponse => {
        const enterPrice = data.enter
        const stopPrice = data.stop
        return {
            id: data._id,
            ticker: data.ticker,
            position: data.position,
            trend: data.trend,
            order: data.order,
            stopPrice,
            enterPrice,
            firstTakePrice: data.firstTakePrice,
            secondTakePrice: data?.secondTakePrice,
            thirdTakePrice: data?.thirdTakePrice,
            riskPercent: data.riskPercent,
            quantity: data.quantity,
            // quantityLost: data.quantity,
            quantityLostInUSD: data.lost,
            // quantityProfit: data.quantity,
            quantityProfitInUSD: data.profit,
            depositBefore: data.depositBefore,
            depositAfter: data.depositAfter,
            resultInUSD: data.resultValue,
            // resultQuantity: data,
            resultPrice: data.resultPrice,
            result: data.result,
            closedManually: data.closedManually,
            closeScenario: data.closeScenario,
            createdBy: data.createdBy,
            dateCreated: data.dateCreated
        }
    }
}

export const tradeService = new TradeService(userService)