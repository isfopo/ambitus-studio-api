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

const userRouter = require("./routes/user");
// const projectRouter = require("./routes/project");
// const sceneRouter = require("./routes/scene");
// const trackRouter = require("./routes/track");
// const clipRouter = require("./routes/clip");
// const messageRouter = require("./routes/message");

app.use("/user", userRouter);

module.exports = app;
