require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const router = require("./routers");
const mongoose = require("mongoose");
const { MONOGCONFIG } = require("./keys");

const server = express();

require('./models/user')
require('./models/post')



//making connection to database
mongoose.connect(MONOGCONFIG, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});
mongoose.connection.on("connected", () => {
  console.log("connection to database is established successfully!");
});
mongoose.connection.on("error", (error) => {
  console.log("an error occurred while connecting to database!", error);
});

server.use(morgan("dev"));
server.use(cors());
server.use(express.urlencoded({ extended: true }));
server.use(express.json());
server.use(router);

server.listen(process.env.PORT, () => {
  console.log(`server is up and running on port ${process.env.PORT}`);
});
