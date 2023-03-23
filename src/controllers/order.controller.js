import { db } from "../database/db.js";

export async function registerOrder(req, res) {

    const order = res.locals.order
    order.totalPrice = order.totalPrice * 100

    try {
        const client = await db.query(`SELECT id FROM clients WHERE id = $1`, [order.clientId])
        console.log(client)
        if (client.rowCount === 0){
            return res.status(404).send("Client does not exist")
        }

        const cake = await db.query(`SELECT id FROM cakes WHERE id = $1`, [order.cakeId])
        if (cake.rowCount === 0){
            return res.status(404).send("Cake does not exist")
        }

        await db.query(`INSERT INTO orders (clientId, cakeId, quantity, totalPrice) VALUES ($1, $2, $3, $4)`, 
            [order.clientId, order.cakeId, order.quantity, order.totalPrice])
        return res.status(201).send("Order registered")

    } catch (error) {
        return res.send(error).status(500)
    }
}