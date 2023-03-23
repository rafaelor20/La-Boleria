import { clientSchema } from "../schemas/clientSchema.js"
export async function clientValidation(req, res, next) {

    const { name, address, phone} = req.body

    const { error } = clientSchema.validate({ name, address, phone}, { abortEarly: false })


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

    res.locals.client =  { name, address, phone}
    next()

}