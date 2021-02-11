"use strict";

// TODO: clean up

const express = require("express");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const app = express();

require("dotenv").config();

app.use(express.json());

app.use(helmet());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.listen(process.env.PORT, () => {
  console.log(`ambitus-studio-api is listening on port ${process.env.PORT}`);
});
