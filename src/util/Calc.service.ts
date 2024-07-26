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

    static getProfit(trade: ITrade) {
        if (!trade.amount) {
            return 0
        }
        if (!trade.secondTake) {
            return this.getTake(trade.firstTake).value * trade.amount
        }
        const firstTake = this.getTake(trade.firstTake)
        const secondTake = this.getTake(trade.secondTake)
        const thirdTake = this.getTake(trade.thirdTake)
        if (thirdTake.percent + secondTake.percent + firstTake.percent !== 100) {
            //todo: handle
            throw new Error('Inconsistent takes supplied')
        }
        return (thirdTake.value + secondTake.value + firstTake.value) * trade.amount
    }

    static getTake(take: string | undefined) {
        if (!take || !take.length) {
            return {value: 0, percent: 0}
        }
        const percent = Number(take.split('/')[1].match(/[0-9]/))
        return {value: +take.split('/')[0], percent}
    }

    static calcClosedManually(trade: ITrade, resultPrice: number, resultValue?: number) {
        if (resultPrice < trade.stop) {
            return null
        }
        const result = resultValue || trade.amount
        const diff = result * resultPrice
        const depositAfter = trade.depositBefore + diff
        return {
            resultValue: result,
            resultPrice,
            depositAfter,
            closedManually: true
        }
    }

    // static calcPartialTake(trade: ITrade, take: TradeEnums.Takes) {
    //
    // }

    static calcSuccess(trade: ITrade, success: boolean) {
        const profit = trade.profit || 0
        const loss = trade.lost || 0
        const depositAfter = trade.depositBefore + (success ?
            profit : loss) || 0
        return {
            resultValue: trade.amount,
            resultPrice: null,
            depositAfter,
            closedManually: false
        }
    }
}