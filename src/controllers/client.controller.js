import { db } from "../database/db.js";

export async function registerClient(req, res) {

    const client = res.locals.client

    try {

        await db.query(`INSERT INTO clients (name, address, phone) VALUES ($1, $2, $3)`, [client.name, client.address, client.phone])
        return res.status(201).send("Client registered")

    } catch (error) {
        return res.send(error).status(500)
    }
}