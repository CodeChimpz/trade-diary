import { TradeEnums} from "./trade.types";

export type TradeRequestData = {
    ticker: number,
    position: TradeEnums.Positions,
    trend: TradeEnums.Trends,
    order: TradeEnums.Orders,
    enter: number,
    stop: number,
    firstTake: string,
    secondTake? :string,
    thirdTake? :string,
    risk: TradeEnums.Risks,
}

export type TradeUpdateData = {
    result: TradeEnums.Results,
    closedManually : boolean
}