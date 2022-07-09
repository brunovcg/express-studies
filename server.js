import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";

dotenv.config();

import router from "./routes";

// usando variaveis de ambiente
const host = process.env.DB_HOST;

console.log(host);

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
