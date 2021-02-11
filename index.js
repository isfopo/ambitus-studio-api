"use strict";

const express = require("express");
const app = express();

const bodyParser = require("body-parser");

require("dotenv").config();

app.use(express.json());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.listen(process.env.PORT, () => {
  console.log(`ambitus-studio-api is listening on port ${process.env.PORT}`);
});
