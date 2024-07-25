import {TradeEnums} from "./trade.types";

export type TradeRequestData = {
    ticker: string,
    position: TradeEnums.Positions,
    trend: TradeEnums.Trends,
    order: TradeEnums.Orders,
    enter: number,
    stop: number,
    firstTake: string,
    secondTake?: string,
    thirdTake?: string,
    risk: TradeEnums.Risks,
}

export type TradeUpdateData = {
    result: TradeEnums.Results,
    resultValue: number,
    closedManually: boolean
}