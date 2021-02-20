const express = require("express");
require("./db/mongodb");
const userRouter = require("./routers/user_router");
const orderRouter = require("./routers/order_router");

const app = express();

app.use(express.json());
app.use(userRouter);
app.use(orderRouter);

module.exports = app;
