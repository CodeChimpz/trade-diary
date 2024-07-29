import {TradeEnums} from "./trade.types";
import {IUser} from "../schema/User.schema";

export type TradeResponse = {
    id: string,
    ticker: string,
    position: TradeEnums.Positions,
    trend: TradeEnums.Trends,
    order: TradeEnums.Orders,
    enterPrice: number,
    stopPrice: number,
    firstTakePrice: string,
    secondTakePrice?: string,
    thirdTakePrice?: string,
    riskPercent: 0.5 | 1 | 2 | 3,
    quantity: number,
    // quantityLost: number | null,
    quantityLostInUSD: number | null,
    // quantityProfit: number | null,
    quantityProfitInUSD: number | null,
    depositBefore: number,
    depositAfter: number | null,
    resultInUSD: number | null,
    resultQuantity: number | null,
    resultPrice: number | null,
    result: string,
    closedManually: boolean,
    closeScenario: TradeEnums.Scenarios | null,
    createdBy: Partial<IUser>,
    dateCreated: Date
}