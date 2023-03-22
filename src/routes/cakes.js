import { Router } from "express"
import { cakeValidation } from "../middlewares/cake.middleware.js"
import { registerCake } from "../controllers/cake.controller.js"


const cakesRouter = Router()

cakesRouter.post('/cakes', cakeValidation, registerCake)

export default cakesRouter