const express = require("express");
var cors = require("cors");
require("./db/mongodb");
const userRouter = require("./routers/user_router");
const orderRouter = require("./routers/order_router");

const app = express();
app.use(cors());

app.use(express.json());
app.use(userRouter);
app.use(orderRouter);

module.exports = app;
