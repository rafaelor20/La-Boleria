import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import cakesRouter from "./routes/cakes.js";
import clientsRouter from "./routes/clients.js";

const app = express();

app.use(express.json());
app.use(cors());

app.use([cakesRouter, clientsRouter])

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running in port ${port}`));