import { Router } from "express"
import { orderValidation } from "../middlewares/order.middleware.js"
import { registerOrder } from "../controllers/order.controller.js"


const ordersRouter = Router()

ordersRouter.post('/order', orderValidation, registerOrder)

export default ordersRouter