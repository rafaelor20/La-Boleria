import { Router } from "express"
import { clientValidation } from "../middlewares/client.middleware.js"
import { registerClient } from "../controllers/client.controller.js"


const clientsRouter = Router()

clientsRouter.post('/clients', clientValidation, registerClient)

export default clientsRouter