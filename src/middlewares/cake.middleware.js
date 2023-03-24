import { cakeSchema } from "../schemas/cakeSchema.js";

export async function cakeValidation(req, res, next) {

    const { name, price, image, description} = req.body

    const { error } = cakeSchema.validate({ name, price, image, description}, { abortEarly: false })


    try {
        if (error) {
            
            if (error.details[0].message === `"name" length must be at least 2 characters long`){
                return res.status(400).send(error.details[0].message)
            } else if (error.details[0].message === `"price" must be greater than 0`){
                return res.status(400).send(error.details[0].message)
            } else {
                return res.status(422).send(error.details[0].message)
            }
        }
    }
    catch (error) {
        console.error(error)
        res.status(500).send("Houve um problema no servidor")
    }

    res.locals.cake =  {name, price, image, description}
    next()

}