import Ajv, { ValidateFunction } from "ajv";
import { Request, Response, NextFunction } from "express";
import plateschema from "../jsonSchema/plate_schema.json"
import dietSchema from "../jsonSchema/diet_schema.json"
import ingredientSchema from "../jsonSchema/ingredient_schema.json"
class Validator {
    private ajv: Ajv;

    constructor() {
        this.ajv = new Ajv();
    }

    /**
     * Middleware function to validate plate data.
     */
    validatePlate(req:any, res:any, next:any) {
        const ajv = new Ajv();
        const validate =  ajv.validate(plateschema,req.body);
        if (!validate) {
            return res.status(422).json({ error: "Incorrect Data Format"});
        }
        next();
    }

    /**
     * Middleware function to validate diet data.
     */
    validateDiet(req:any, res:any, next:any) {
        const ajv = new Ajv();
        const validate =  ajv.validate(dietSchema,req.body);
        if (!validate) {
            return res.status(422).json({ error: "Incorrect Data Format"});
        }
        next();
    }

    /**
     * Middleware function to validate ingredient data.
     */
    validateIngredient(req:any, res:any, next:any) {
        const ajv = new Ajv();
        const validate =  ajv.validate(ingredientSchema,req.body);
        if (!validate) {
            return res.status(422).json({ error: "Incorrect Data Format"});
        }
        next();
    }
}

export default Validator;