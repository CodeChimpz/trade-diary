import {ITrade} from "../schema/Trade.schema";
import {TradeEnums} from "../types/trade.types";

export class CalcService {
    static getPercent(value: number, percent: number) {
        return value / 100 * percent
    }

    static getTradeAmount(trade: ITrade) {
        //todo : float precision
        const {depositBefore, risk, enter, stop} = trade
        const riskAmount = this.getPercent(depositBefore, risk)
        const stopDiff = enter - stop
        const amount = riskAmount / stopDiff
        // console.log('debug-getTradeAmount', depositBefore, risk, enter, riskAmount, stop, stopDiff, amount)
        return amount
    }

    static getLost(trade: ITrade) {
        if (!trade.amount) {
            return 0
        }
        // console.log('debug-getLost', trade.amount * trade.stop, trade.risk * trade.depositBefore)
        return trade.amount * trade.stop
    }

    static getProfit(trade: ITrade, take?: TradeEnums.Scenarios) {
        if (!trade.amount) {
            return {
                amount: 0,
                value: 0
            }
        }
        const firstTake = this.getTake(trade.firstTake)
        const secondTake = !trade.secondTake || take === TradeEnums.Scenarios.First ? {
            value: 0,
            percent: 0
        } : this.getTake(trade.secondTake)
        const thirdTake = !trade.thirdTake || take === TradeEnums.Scenarios.Second ? {
            value: 0,
            percent: 0
        } : this.getTake(trade.thirdTake)
        if (thirdTake.percent + secondTake.percent + firstTake.percent !== 100) {
            //todo: handle
            throw new Error('Inconsistent takes supplied')
        }
        const firstValue = this.getTakeValue(trade.amount, thirdTake.value, thirdTake.percent)
        const secondValue = this.getTakeValue(trade.amount, secondTake.value, secondTake.percent)
        const thirdValue = this.getTakeValue(trade.amount, firstTake.value, firstTake.percent)
        return {
            amount: firstValue.percent + secondValue.percent + thirdValue.percent,
            value: firstValue.value + secondValue.value + thirdValue.value
        }
    }

    static getTake(take: string | undefined) {
        if (!take || !take.length) {
            return {value: 0, percent: 0}
        }
        const percent = Number(take.split('/')[1].match(/[0-9]/))
        return {value: +take.split('/')[0], percent}
    }

    static getTakeValue(amount: number, takeValue: number, takePercent: number) {
        //todo: util
        if (!takeValue) {
            return {percent: 0, value: 0}
        }
        const percent = amount / 100 * takePercent
        return {
            percent, value: percent * takeValue
        }
    }

    static calcClosedManually(trade: ITrade, resultPrice: number) {
        const resultValue = trade.amount
        const diff = resultValue * resultPrice
        const depositAfter = trade.depositBefore + diff
        return {
            resultValue: resultValue,
            resultPrice,
            depositAfter,
            closedManually: true
        }
    }

    static calcSuccessScenario(trade: ITrade, take?: TradeEnums.Scenarios) {
        const profit = this.getProfit(trade, take)
        const depositAfter = trade.depositBefore + profit.value
        return {
            resultValue: profit.amount,
            resultPrice: null,
            closeScenario: take,
            depositAfter,
            closedManually: false
        }
    }

    static calcFailure(trade: ITrade) {
        const loss = trade.lost || 0
        const depositAfter = trade.depositBefore + loss
        return {
            resultValue: trade.amount,
            resultPrice: trade.stop,
            depositAfter,
            closeScenario: TradeEnums.Scenarios.Stop,
            closedManually: false
        }
    }
}