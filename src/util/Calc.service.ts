import {ITrade} from "../schema/Trade.schema";
import {TradeEnums} from "../types/trade.types";

export class CalcService {
    static getPercent(value: number, percent: number) {
        return value / 100 * percent
    }

    static getTradeAmount(trade: ITrade) {
        //todo : float precision
        const {depositBefore, riskPercent, enter, stop} = trade
        const riskAmount = this.getPercent(depositBefore, riskPercent)
        const stopDiff = enter - stop
        return riskAmount / stopDiff
    }

    static getLost(trade: ITrade) {
        if (!trade.quantity) {
            return {
                amount: 0,
                value: 0
            }
        }
        const {quantity, depositBefore, riskPercent} = trade
        return {
            amount: quantity,
            value: this.getPercent(depositBefore, riskPercent)
        }
    }

    static getProfit(trade: ITrade, partialTake: boolean, take: TradeEnums.Scenarios | null) {
        if (!trade.quantity) {
            return {
                amount: 0,
                value: 0
            }
        }
        const firstTake = this.getTake(trade.firstTakePrice)
        const isFullSecond = !trade.secondTakePrice || take === TradeEnums.Scenarios.First
        const isFullThird = !trade.thirdTakePrice || take === TradeEnums.Scenarios.Second
        const secondTake = isFullSecond ? {
            value: 0,
            percent: 0
        } : this.getTake(trade.secondTakePrice)
        const thirdTake = isFullThird ? {
            value: 0,
            percent: 0
        } : this.getTake(trade.thirdTakePrice)
        if (!partialTake && thirdTake.percent + secondTake.percent + firstTake.percent !== 100) {
            console.log('takes', thirdTake.percent, secondTake.percent, firstTake.percent)
            //todo: handle
            throw new Error('Inconsistent takes supplied')
        }
        const firstValue = this.getTakeValue(trade, thirdTake.value, thirdTake.percent)
        const secondValue = this.getTakeValue(trade, secondTake.value, secondTake.percent)
        const thirdValue = this.getTakeValue(trade, firstTake.value, firstTake.percent)
        return {
            amount: firstValue.percent + secondValue.percent + thirdValue.percent,
            value: firstValue.value + secondValue.value + thirdValue.value
        }
    }

    static getTake(take: string | undefined) {
        if (!take || !take.length) {
            return {value: 0, percent: 0}
        }
        const percent = Number(take.split('/')[1].match(/[0-9]{2,3}/))
        return {value: +take.split('/')[0], percent}
    }

    static getTakeValue(trade: ITrade, takeValue: number, takePercent: number) {
        //todo: util
        if (!takeValue) {
            return {percent: 0, value: 0}
        }
        const percent = trade.quantity / 100 * takePercent
        return {
            percent, value: percent * (takeValue - trade.enter)
        }
    }

    static calcClosedManually(trade: ITrade, resultPrice: number) {
        const resultValue = trade.quantity
        const profit = resultValue * (resultPrice - trade.enter)
        const depositAfter = trade.depositBefore + profit
        return {
            result: depositAfter < trade.depositBefore ? TradeEnums.Results.Failure : TradeEnums.Results.Success,
            resultValue: resultValue,
            profit,
            resultPrice,
            depositAfter,
            closedManually: true
        }
    }

    static calcSuccessScenario(trade: ITrade, take: TradeEnums.Scenarios | null) {
        const successScenario =
            (!trade.secondTakePrice && take === TradeEnums.Scenarios.First) ||
            (!trade.thirdTakePrice && take === TradeEnums.Scenarios.Second) ||
            (trade.thirdTakePrice && take === TradeEnums.Scenarios.Third) ? TradeEnums.Results.Success :
                TradeEnums.Results.PartiallyClosed
        const profit = this.getProfit(trade, successScenario === TradeEnums.Results.PartiallyClosed, take)
        const depositAfter = trade.depositBefore + profit.value
        return {
            result: successScenario,
            resultValue: profit.amount,
            resultPrice: null,
            closeScenario: take,
            profit: profit.value,
            depositAfter,
            closedManually: false
        }
    }

    static calcFailure(trade: ITrade) {
        const loss = trade.lost || 0
        const depositAfter = trade.depositBefore - loss
        return {
            result: 'Failure',
            resultValue: trade.quantity,
            resultPrice: trade.stop,
            depositAfter,
            closeScenario: TradeEnums.Scenarios.Stop,
            closedManually: false
        }
    }
}