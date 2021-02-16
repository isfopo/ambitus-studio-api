"use strict";

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

const timeSignature = (input) => {};

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

const setting = (input) => {};

const type = (input) => {
  // values = [
  //   "audio/aac",
  //   "audio/mpeg",
  //   "audio/ogg",
  //   "audio/webm",
  //   "audio/wave",
  //   "audio/midi",
  // ];
};

module.exports = {
  name,
  tempo,
  timeSignature,
  message,
  setting,
  type,
};
