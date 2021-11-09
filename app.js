const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
//Envoriment File
require("dotenv/config");
const authJwt = require("./helpers/jwt");
const errorHandler = require("./helpers/error-handler");
const api = process.env.API_URL;
const productsRoutes = require("./routers/products");
const categoriesRoutes = require("./routers/categories");
const ordersRoutes = require("./routers/orders");
const usesrRoutes = require("./routers/users");

//middleware
app.use(cors());
app.options("*", cors());
app.use(bodyParser.json());
app.use(morgan("tiny"));
app.use(authJwt());
app.use(errorHandler);
//Routers
app.use(`${api}/products`, productsRoutes);
app.use(`${api}/categories`, categoriesRoutes);
app.use(`${api}/orders`, ordersRoutes);
app.use(`${api}/users`, usesrRoutes);

//Moongoose connection
mongoose
  .connect(process.env.CONNECTION_STRING)
  .then(() => console.log("DB is Connected"))
  .catch((err) => console.log(err));
app.listen(5000, () => console.log("Server started on port 5000", api));
