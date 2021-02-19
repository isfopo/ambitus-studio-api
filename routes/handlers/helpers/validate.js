"use strict";

const _ = require("lodash");

const id = (id = "") => {
  const uuidRegex = new RegExp(
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  );
  if (id.match(uuidRegex)) {
    return id;
  } else {
    throw new Error("id must be valid uuid");
  }
};

const name = (name = "") => {
  if (typeof name !== "string") {
    throw new Error("name must be a string");
  } else if (name.length < 3) {
    throw new Error("name must be at least 3 characters");
  } else if (name.length > 18) {
    throw new Error("name must be no more than 18 characters");
  } else {
    return name;
  }
};

const password = (password = "") => {
  if (typeof password !== "string") {
    throw new Error("password must be a string");
  } else if (password.length < 8) {
    throw new Error("password must be at least 8 characters");
  } else if ((password.match(/[a-zA-Z]/g) || []).length < 2) {
    throw new Error("password must have at least two characters");
  } else if ((password.match(/[A-Z]/g) || []).length < 1) {
    throw new Error("password must have at least one capital letter");
  } else if ((password.match(/[1-9]/g) || []).length < 1) {
    throw new Error("password must have at least one number");
  } else if ((password.match(/[^\w\s]/g) || []).length < 1) {
    throw new Error("password must have at least one special character");
  } else if ((password.match(/\s/g) || []).length > 0) {
    throw new Error("password must not have any spaces");
  } else {
    return password;
  }
};

const avatar = (avatar = {}) => {
  const values = ["image/jpeg", "image/png"];

  if (!values.includes(avatar.mimetype)) {
    throw new Error("avatar must be jpeg or png");
  } else if (avatar.size > 2147483648) {
    throw new Error("avatar must less than 2GB");
  } else {
    return avatar;
  }
};

const tempo = (tempo = 0) => {
  if (typeof tempo !== "number") {
    throw new Error("tempo must be a number");
  } else if (tempo % 1 !== 0) {
    throw new Error("tempo must be an integer");
  } else if (tempo < 40) {
    throw new Error("tempo must be at least 40 bpm");
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
    "audio/x-midi",
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
  id,
  name,
  password,
  avatar,
  tempo,
  timeSignature,
  message,
  settings,
  type,
};
