import { clientSchema } from "../schemas/clientSchema.js"

export async function clientValidation(req, res, next) {

    const { name, address, phone} = req.body

    const { error } = clientSchema.validate({ name, address, phone}, { abortEarly: false })


    try {
        if (error) {
            console.log(error.details[0].message)
            if (error.details[0].message === `\"phone\" length must be at least 10 characters long`){
                return res.status(400).send(error)
            } else if (error.details[0].message === `"phone" length must be less than or equal to 11 characters long`){
                return res.status(400).send(error)
            } else if (error.details[0].message === `"name" is not allowed to be empty`){
                return res.status(400).send(error)
            } else if (error.details[0].message === `"address" is not allowed to be empty`){
                return res.status(400).send(error)
            } else {
                return res.status(422).send(error)
            }
        }
    }
    catch (error) {
        console.error(error)
        res.status(500).send("Houve um problema no servidor")
    }

    res.locals.client =  { name, address, phone}
    next()

}