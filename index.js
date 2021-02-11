"use strict";

// TODO: clean up

const express = require("express");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const logger = require("morgan");

const app = express();

require("dotenv").config();

app.use(logger("dev"));

app.use(express.json());

app.use(helmet());

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.listen(process.env.PORT, () => {
  console.log(`ambitus-studio-api is listening on port ${process.env.PORT}`);
});
