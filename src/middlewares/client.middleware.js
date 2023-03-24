import { clientSchema } from "../schemas/clientSchema.js"

export async function clientValidation(req, res, next) {

    const { name, address, phone} = req.body

    const { error } = clientSchema.validate({ name, address, phone}, { abortEarly: false })


    try {
        if (error) {
            console.log(error.details[0].message)
            if (error.details[0].message === `"phone"length must be at least 10 characters long`){
                return res.status(400).send("Phone must have 10 or 11 digits")
            } else if (error.details[0].message === `"phone" length must be less than or equal to 11 characters long`){
                return res.status(400).send("Phone must have 10 or 11 digits")
            } else if (error.details[0].message === `"name" is not allowed to be empty`){
                return res.status(400).send("error.details[0].message")
            } else if (error.details[0].message === `"address" is not allowed to be empty`){
                return res.status(400).send("error.details[0].message")
            } else {
                return res.status(422).send("There is a problem with your data")
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