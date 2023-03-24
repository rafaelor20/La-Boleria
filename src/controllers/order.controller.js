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

        await db.query(`INSERT INTO orders ("clientId", "cakeId", quantity, "totalPrice") VALUES ($1, $2, $3, $4)`,
            [order.clientId, order.cakeId, order.quantity, order.totalPrice])
        return res.status(201).send("Order registered")

    } catch (error) {
        return res.send(error).status(500)
    }
}

export async function getOrdersByClientId(req, res) {
    const id = req.params.id
    
    try {
        const orders = await db.query(`SELECT orders.id, orders.quantity, orders."createdAt", orders."totalPrice", cakes.name FROM orders 
        JOIN cakes ON (orders."cakeId" = cakes.id) 
        WHERE orders."clientId" = $1`, [id])

        if (orders.rowCount === 0) {
            return res.status(404).send("No orders registered")
        } else {
            return res.status(200).send(transformList(orders.rows))
        }
    } catch (error) {
        return res.send(error).status(500)
    }
}

export async function getOrdersById(req, res) {
    const id = req.params.id
    try {
        const orders = await db.query(`SELECT * FROM orders 
        JOIN cakes ON (orders."cakeId" = cakes.id) 
        JOIN clients ON (orders."clientId" = clients.id)
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
            const orders = await db.query(`SELECT orders.*, clients.*, cakes.name as "cakeName", cakes.* FROM orders 
            JOIN cakes ON (orders."cakeId" = cakes.id) 
            JOIN clients ON (orders."clientId" = clients.id)`)

            if (orders.rowCount === 0) {
                return res.status(404).send("No orders registered")
            } else {
                return res.status(200).send(transformData(orders.rows))
            }

        } else {

            const { error } = dateSchema.validate({ date }, { abortEarly: false })

            if (error) {
                return res.status(422).send(error)
            } else {
                
                const orders = await db.query(`SELECT orders.*, clients.*, cakes.name as "cakeName", cakes.* FROM orders 
                JOIN cakes ON (orders."cakeId" = cakes.id) 
                JOIN clients ON (orders."clientId" = clients.id) 
                WHERE date_trunc('day', orders."createdAt") = $1`, [date])

                if (orders.rowCount === 0) {
                    return res.status(404).send("No orders registered")
                } else {
                    return res.status(200).send(transformData(orders.rows))
                }

            }

        }

    } catch (error) {
        return res.status(500).send(error)
    }
}

function transformList(list) {
    const transformedList = [];
    
    for (let item of list) {
      const { id, quantity, createdAt, totalPrice, name } = item;
      
      const date = createdAt;
      const formattedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
      
      
      const transformedItem = {
        orderId: id,
        quantity: quantity,
        createdAt: formattedDate,
        totalPrice: totalPrice / 100, 
        cakeName: name
      };
      
      transformedList.push(transformedItem);
    }
    
    return transformedList;
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
            id: item.clientId,
            name: item.name,
            address: item.address,
            phone: item.phone
        };

        const cake = {
            id: item.cakeId,
            name: item.cakeName,
            price: formatPrice(item.price),
            description: item.description,
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
