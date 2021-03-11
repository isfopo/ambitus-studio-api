"use strict";

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

app.use(bodyParser.json()); //TODO: bodyParser is deprecated

const routes = ["user", "project", "scene", "track", "clip", "message"];

routes.forEach((route) => {
  app.use(`/${route}`, require(`./routes/${route}`));
});

module.exports = app;
