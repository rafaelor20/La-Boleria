import joi from "joi"

export const cakeSchema = joi.object ({
    name: joi.string().min(2).required(),
    price: joi.number().greater(0).required(),
    image: joi.string().uri().max(250).required(),
    description: joi.string().max(250).allow(null).allow('').optional()
})