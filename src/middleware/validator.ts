import Joi from "joi";
import {NextFunction, Request, Response} from "express";

export function JoiValidatorMiddleware(schema: Joi.ObjectSchema) {
    return async (req: Request, res: Response, next: NextFunction) => {
        const {error} = schema.validate(req.body);
        if (error) return res.status(400).json(`Validation failed : ${error.details[0].message}`);
        next()
    }
}