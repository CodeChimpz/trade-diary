import {Request, Response} from 'express'
import {tradeService} from "../services/Trade.service";

export class TradeController {
    constructor() {
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
        //logic
        const data = {}
        res.status(200).json(data);
    }
}

export const tradeController = new TradeController()