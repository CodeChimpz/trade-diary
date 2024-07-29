import {TradeEnums} from "./trade.types";

export type TradeRequestData = {
    ticker: TradeEnums.Tickers,
    position: TradeEnums.Positions,
    trend: TradeEnums.Trends,
    order: TradeEnums.Orders,
    enter: number,
    stop: number,
    firstTakePrice: string,
    secondTakePrice?: string,
    thirdTakePrice?: string,
    riskPercent: TradeEnums.Risks,
}

export type TradeUpdateData = {
    resultPrice?: number,
    scenario: TradeEnums.Scenarios | null,
}