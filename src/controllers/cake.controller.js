import { db } from "../database/db.js";

export async function registerCake(req, res) {

    const cake = res.locals.cake

    try {

        const checkName = await db.query(`SELECT name FROM cakes WHERE name = $1`, [cake.name])
        if (checkName.rowCount > 0){
            return res.send("Cake already registered").status(409)
        } else {
            cake.price = parseInt(cake.price * 100)
            await db.query(`INSERT INTO cakes (name, price, image, description) VALUES ($1, $2, $3, $4)`, [cake.name, cake.price, cake.image, cake.description])
            return res.status(201).send("Cake registered")
        }

    } catch (error) {
        return res.send(error).status(500)
    }
}