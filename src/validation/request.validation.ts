import Joi from "joi";
import {TradeEnums} from "../types/trade.types";

const Positions = ['Long', 'Short'];
const Tickers = ['BTC/USDT', 'ETH/USDT'];
const Trends = ['Up', 'Down'];
const Orders = ['Limit', 'Market'];
const Risks = [0.5, 1, 2, 3];

export const schemaTrade = Joi.object({
    ticker: Joi.string().valid(...Tickers).required(),
    position: Joi.string().valid(...Positions).required(),
    trend: Joi.string().valid(...Trends).required(),
    order: Joi.string().valid(...Orders).required(),
    enter: Joi.number().required(),
    stop: Joi.number().required()
        .when('position', {
            is: 'Long',
            then: Joi.number().less(Joi.ref('enter')),
            otherwise: Joi.number().greater(Joi.ref('enter'))
        }),
    firstTakePrice: Joi.string().pattern(/^[0-9]* \/ [0-9]{2,3}%*$/).required(),
    secondTakePrice: Joi.string().pattern(/^[0-9]* \/ [0-9]{2,3}%*$/).optional(),
    thirdTakePrice: Joi.string().pattern(/^[0-9]* \/ [0-9]{2,3}%*$/).optional(),
    riskPercent: Joi.string().valid(...Risks).required(),
});


const Scenarios = ['First', 'Second', 'Third', 'Stop'];

export const tradeUpdateSchema = Joi.object({
    resultPrice: Joi.number().optional(),
    scenario: Joi.string().valid(...Scenarios).allow(null).required()
});