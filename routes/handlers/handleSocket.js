const { omitBy } = require("lodash");
const User = require("./user");

let interval;

let io, socket;

const connect = (ioParam, socketParam) => {
  try {
    io = ioParam;
    socket = socketParam;

    console.log("New client connected");
    //socket.join(socket.handshake.query.ProjectId); //joins room with ProjectId
    //console.log(socket.rooms); // get rooms
    //console.log(io.sockets.adapter.rooms); // gets clients in rooms
    //console.log(socket.handshake);

    const userId = authorize(socket.handshake); // TODO: catch error and disconnect

    io.to(socket.handshake.query.ProjectId).emit(
      "roomInfo",
      "a new User has joined"
      // TODO: broadcast which users are in the room
    );

    if (interval) {
      clearInterval(interval);
    }
    interval = setInterval(() => getApiAndEmit(socket), 1000);

    socket.on("disconnect", (reason) => {
      console.log("Client disconnected");
      socket.leave(socket.handshake.query.ProjectId);
      console.log(io.sockets.adapter.rooms);
      io.to(socket.handshake.query.ProjectId).emit(
        "roomInfo",
        "a user has left"
      );
      clearInterval(interval);
    });
  } catch (e) {
    io.to(socket.handshake.query.ProjectId).emit();
  }
};

/**
 * parses and verifies token in handshake
 * @param {Object} handshake authorization handshake
 * @returns {String} User Id
 */
const authorize = (handshake) => {
  try {
    const token = parseHandshakeForToken(handshake);
    return User.verifyToken(token);
  } catch (e) {
    throw e;
  }
};

/**
 * parses handshake to get authorization token
 * @param {Object} handshake handshake from req.handshake;
 * @returns {String} token
 */
const parseHandshakeForToken = (handshake = {}) => {
  const authorization = handshake["auth"];
  if (typeof authorization !== "undefined") {
    const bearer = authorization.token.split(" ");
    return bearer[1];
  } else {
    throw new Error("token not present");
  }
};

// TODO: create function that broadcasts change
// TODO: this function should tell the path to get and any relevant information for that change
// TODO: put this function in all PUT routes in users, project, scenes, tracks, clips and messages
// use io and socket variables

const getApiAndEmit = (socket) => {
  const response = new Date();
  // Emitting a new message. Will be consumed by the client
  socket.emit("FromAPI", response);
};

module.exports = {
  connect,
};
