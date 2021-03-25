"use strict";

const express = require("express");
const helmet = require("helmet");
const logger = require("morgan");
const cors = require("cors");

const app = express();

require("dotenv").config();

app.use(logger("dev"));

app.use(express.json());

app.use(helmet());

app.use(cors({ origin: "http://localhost:1212" }));

app.use(express.urlencoded({ extended: false }));

app.use(express.json());

const routes = ["user", "project", "scene", "track", "clip", "message"];

routes.forEach((route) => {
  app.use(`/${route}`, require(`./routes/${route}`));
});

module.exports = app;
