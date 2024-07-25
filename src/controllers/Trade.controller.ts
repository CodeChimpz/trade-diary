import {Request, Response} from 'express'
import {TradeService, tradeService} from "../services/Trade.service";

export class TradeController {
    service: TradeService

    constructor(service: TradeService) {
        this.service = service
    }

    getTrades = async (req: Request, res: Response) => {
        //logic
        const data = tradeService.getTrades()
        res.status(200).json(data);
    }

    getTrade = async (req: Request, res: Response) => {
        //logic
        const data = {}
        res.status(200).json(data);
    }

    postTrade = async (req: Request, res: Response) => {
        //todo : interceptor decorator
        try {
            const payload = req.body
            const userId = req.params.userId
            const data = await this.service.postTrade(userId, payload)
            if (!data) {
                res.status(404).json({message: 'Couldn\'t post trade , check data accuracy and user id'})
            }
            res.status(200).json(data);
        } catch (e) {
            res.status(500).json({message: 'Server error'})
        }
    }

    closeTrade = async (req: Request, res: Response) => {
        //logic
        const data = {}
        res.status(200).json(data);
    }
}

export const tradeController = new TradeController(tradeService)