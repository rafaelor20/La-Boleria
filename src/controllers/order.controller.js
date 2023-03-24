import { db } from "../database/db.js";
import { dateSchema } from "../schemas/dateSchema.js";

export async function registerOrder(req, res) {

    const order = res.locals.order
    order.totalPrice = order.totalPrice * 100

    try {
        const client = await db.query(`SELECT id FROM clients WHERE id = $1`, [order.clientId])

        if (client.rowCount === 0) {
            return res.status(404).send("Client does not exist")
        }

        const cake = await db.query(`SELECT id FROM cakes WHERE id = $1`, [order.cakeId])
        if (cake.rowCount === 0) {
            return res.status(404).send("Cake does not exist")
        }

        await db.query(`INSERT INTO orders (clientId, "cakeId", quantity, totalPrice) VALUES ($1, $2, $3, $4)`,
            [order.clientId, order.cakeId, order.quantity, order.totalPrice])
        return res.status(201).send("Order registered")

    } catch (error) {
        return res.send(error).status(500)
    }
}

export async function getOrdersById(req, res) {
    const id = req.params.id
    try {
        const orders = await db.query(`SELECT * FROM orders 
        JOIN cakes ON (orders.cakeId = cakes.id) 
        JOIN clients ON (orders.clientId = clients.id)
        WHERE orders.id = $1`, [id])

        if (orders.rowCount === 0) {
            return res.status(404).send("No orders registered")
        } else {
            return res.status(200).send(transformData(orders.rows))
        }
    } catch (error) {
        return res.send(error).status(500)
    }
}

export async function getOrders(req, res) {
    try {

        const date = req.query.date

        if (date === undefined) {
            const orders = await db.query(`SELECT * FROM orders JOIN cakes ON (orders.cakeId = cakes.id) JOIN clients ON (orders.clientId = clients.id)`)

            if (orders.rowCount === 0) {
                return res.status(404).send("No orders registered")
            } else {
                return res.status(200).send(transformData(orders.rows))
            }

        } else {

            const { error } = dateSchema.validate({ date }, { abortEarly: false })

            if (error) {
                return res.send(error).status(422)
            } else {
                console.log(formatDate(date))
                const orders = await db.query(`SELECT * FROM orders 
                JOIN cakes ON (orders.cakeId = cakes.id) 
                JOIN clients ON (orders.clientId = clients.id) 
                WHERE orders.createdAt = %1`, [formatDate(date)])

                if (orders.rowCount === 0) {
                    return res.status(404).send("No orders registered")
                } else {
                    return res.status(200).send(transformData(orders.rows))
                }

            }

        }

    } catch (error) {
        return res.send(error).status(500)
    }
}

function formatDate(date) {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: 'numeric', minute: 'numeric' };
    return new Date(date).toLocaleString('pt-BR', options);
}

function formatPrice(price) {
    return (price / 100).toFixed(2);
}

function transformData(data) {
    return data.map(item => {
        const client = {
            id: item.clientid,
            name: item.name,
            address: item.address,
            phone: item.phone
        };

        const cake = {
            id: item.cakeid,
            name: item.description,
            price: formatPrice(item.price),
            image: item.image
        };

        return {
            client,
            cake,
            orderId: item.id,
            createdAt: formatDate(item.createdat),
            quantity: item.quantity,
            totalPrice: formatPrice(item.totalprice)
        };
    });
}
