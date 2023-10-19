import {NextFunction, Response} from "express";
import {body, validationResult} from "express-validator";

export const handleError = (req: any, res: any, next: NextFunction) => {
    const error = validationResult(req)
    if (!error.isEmpty()) {
        res.status(400).json({error: error.array()})
        return
    }
    next()

}