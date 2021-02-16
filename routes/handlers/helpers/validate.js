"use strict";

const _ = require("lodash");

const name = (name = "") => {
  if (typeof name !== "string") {
    throw new Error("name must be a string");
  } else if (name.length < 3) {
    throw new Error("name must be greater than 3 characters");
  } else if (name.length > 18) {
    throw new Error("name must be less than 18 characters");
  } else {
    return name;
  }
};

const tempo = (tempo = 0) => {
  if (typeof tempo !== "number") {
    throw new Error("tempo must be a number");
  } else if (tempo % 1 !== 0) {
    throw new Error("tempo must be an integer");
  } else if (tempo < 40) {
    throw new Error("tempo must be greater than 40 bpm");
  } else if (tempo > 280) {
    throw new Error("tempo must be less than 280 bpm");
  } else {
    return tempo;
  }
};

const timeSignature = (timeSignature = "") => {
  let split, upper, lower;

  const isPowerOfTwo = (number) => {
    return number && !(number & (number - 1));
  };

  try {
    split = timeSignature.split("/");
    upper = parseInt(split[0]);
    lower = parseInt(split[1]);
  } catch (e) {
    throw new Error("timeSignature must be a string");
  }

  if (!timeSignature.includes("/")) {
    throw new Error("timeSignature must have a '/'");
  } else if (isNaN(upper) || isNaN(lower)) {
    throw new Error("timeSignature must have an upper and lower numbers");
  } else if (lower < 1) {
    throw new Error("lower number must be greater than 1");
  } else if (lower > 32) {
    throw new Error("lower number must be less than 32");
  } else if (!isPowerOfTwo(lower)) {
    throw new Error("lower number must be a power of two");
  } else if (upper < 1) {
    throw new Error("upper number must be greater than 1");
  } else if (upper > 32) {
    throw new Error("upper number must be less than 32");
  } else {
    return timeSignature;
  }
};

const message = (message = "") => {
  if (typeof message !== "string") {
    throw new Error("message must be a string");
  } else if (message.length < 1) {
    throw new Error("message must be greater than 1 character");
  } else if (message.length > 150) {
    throw new Error("message must be less than 150 characters");
  } else {
    return message;
  }
};

const settings = (settings = {}) => {
  if (!_.isObject(settings)) {
    throw new Error("settings must be an object");
  } else {
    return settings;
  }
};

const type = (type = "") => {
  const values = [
    "audio/aac",
    "audio/mpeg",
    "audio/ogg",
    "audio/webm",
    "audio/wave",
    "audio/midi",
  ];

  if (typeof type !== "string") {
    throw new Error("type must be a string");
  } else if (!values.includes(type)) {
    throw new Error(`type must be "audio/aac",
    "audio/mpeg",
    "audio/ogg",
    "audio/webm",
    "audio/wave" or
    "audio/midi"`);
  } else {
    return type;
  }
};

module.exports = {
  name,
  tempo,
  timeSignature,
  message,
  settings,
  type,
};
