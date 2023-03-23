import { orderSchema } from "../schemas/orderSchema.js"

export async function orderValidation(req, res, next) {

    const { clientId, cakeId, quantity, totalPrice} = req.body

    const { error } = orderSchema.validate({ clientId, cakeId, quantity, totalPrice}, { abortEarly: false })


    try {
        if (error) {
            console.log(error)
            return res.status(422).send("Há um erro com os dados")
        }
    }
    catch (error) {
        console.error(error)
        res.status(500).send("Houve um problema no servidor")
    }

    res.locals.order =  { clientId, cakeId, quantity, totalPrice}
    next()

}