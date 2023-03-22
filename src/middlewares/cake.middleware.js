import { cakeSchema } from "../schemas/cakeSchema.js";

export async function cakeValidation(req, res, next) {

    const { name, price, image, description} = req.body

    const { error } = cakeSchema.validate({ name, price, image, description}, { abortEarly: false })


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

    res.locals.cake =  {name, price, image, description}
    next()

}