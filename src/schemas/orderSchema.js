import joi from "joi"

export const orderSchema = joi.object ({
    clientId: joi.number().required(),
    cakeId: joi.number().required(),
    quantity: joi.number().min(1).max(5).required(),
    totalPrice: joi.number().required()
})