import express from "express";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
import { logRequestInConsole } from "./middleware/consolelog";
import * as yup from "yup";
import { validate } from "./middleware/validade";
import { authenticateUser } from "./middleware/authenticate";
import dotenv from "dotenv";
import * as bcrypt from "bcryptjs";
dotenv.config();

import router from "./routes";

// usando variaveis de ambiente
const host = process.env.DB_HOST;
const username = process.env.DB_USER;
const password = process.env.DB_PASS;

// Instanciando um app do express
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());
app.use(router);

/* --------------------------------
app.use("/user", userRouter)
app.use("/product", productRouter)
app.use("/category", categoryRouter)



*/

//! passando o middleware assim todas a rotas usam, senão, so a que por
// app.use(logRequestInConsole);

app.listen(3002);
