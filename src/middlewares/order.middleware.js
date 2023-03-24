import { orderSchema } from "../schemas/orderSchema.js"

export async function orderValidation(req, res, next) {

    const { clientId, cakeId, quantity, totalPrice} = req.body

    const { error } = orderSchema.validate({ clientId, cakeId, quantity, totalPrice}, { abortEarly: false })


    try {
        if (error) {
            console.log(error)

            if (error.details[0].message === `"quantity" must be less than or equal to 5`){
                return res.status(400).send(error)
            } else {
                return res.status(422).send(error)
            }

        }
    }
    catch (error) {
        console.error(error)
        res.status(500).send(error)
    }

    res.locals.order =  { clientId, cakeId, quantity, totalPrice}
    next()

}