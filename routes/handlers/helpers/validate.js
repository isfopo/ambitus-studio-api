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

const tempo = (input) => {};

const timeSignature = (input) => {};

const message = (input) => {};

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
