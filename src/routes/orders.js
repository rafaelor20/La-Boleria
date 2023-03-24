import { Router } from "express"
import { orderValidation } from "../middlewares/order.middleware.js"
import { registerOrder, getOrders, getOrdersById } from "../controllers/order.controller.js"


const ordersRouter = Router()

ordersRouter.post('/order', orderValidation, registerOrder)
ordersRouter.get('/orders', getOrders)
ordersRouter.get('/orders/:id', getOrdersById)

export default ordersRouter