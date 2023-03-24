import { Router } from "express"
import { orderValidation } from "../middlewares/order.middleware.js"
import { registerOrder, getOrders, getOrdersById, getOrdersByClientId } from "../controllers/order.controller.js"


const ordersRouter = Router()

ordersRouter.post('/order', orderValidation, registerOrder)
ordersRouter.get('/orders', getOrders)
ordersRouter.get('/orders/:id', getOrdersById)
ordersRouter.get('/clients/:id/orders', getOrdersByClientId)

export default ordersRouter