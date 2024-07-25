import {ITrade, Trade, TradeModel} from "../schema/Trade.schema";
import {userService, UserService} from "./User.service";

export class TradeService {
    schema: TradeModel
    userService: UserService

    constructor(userService: UserService) {
        this.schema = Trade
        this.userService = userService
    }

    getTrades = async () => {

    }

    getTrade = async () => {

    }

    postTrade = async (userId: string, payload: any) => {
        const user = await this.userService.getById(userId)
        if (!user) {
            return null
        }
        const data = this.createTradePayload(payload)
        console.log(user)
        const created = await this.schema.create({
            ...data,
            createdBy: user
        })
        return this.processTradePayload(created)
    }

    private createTradePayload = (data: any) => {
        return data
    }

    private processTradePayload = (data: ITrade) => {
        return data
    }
}

export const tradeService = new TradeService(userService)