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
const jobRoutes = require("./routers/jobs");
const usesrRoutes = require("./routers/users");
const applyJobRoutes = require("./routers/apply-job");
//Middlewares
app.use(cors());
app.options("*", cors());
app.use(bodyParser.json());
app.use(morgan("tiny"));
app.use(authJwt());
app.use(errorHandler);
app.use("/public/uploads", express.static(__dirname + "/public/uploads"));
//Routers
app.use(`${api}/job`, jobRoutes);
app.use(`${api}/users`, usesrRoutes);
app.use(`${api}/apply-job`, applyJobRoutes);

//Moongoose connection
mongoose
  .connect(process.env.CONNECTION_STRING)
  .then(() => console.log("DB is Connected"))
  .catch((err) => console.log(err));
app.listen(5000, () => console.log("Server started on port 5000", api));
