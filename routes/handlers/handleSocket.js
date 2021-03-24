const User = require("./user");
const Project = require("./project");

let interval;

let io, socket;

const connect = async (ioParam, socketParam) => {
  try {
    io = ioParam;
    socket = socketParam;

    const user = await User.findInDatabase(authorize(socket.handshake));
    const project = await Project.findInDatabase(
      socket.handshake.query.ProjectId
    );
    socket.join(socket.handshake.query.ProjectId); //joins room with ProjectId

    console.log(`${user.username} is working on ${project.name}`);

    io.to(socket.handshake.query.ProjectId).emit("status", {
      project,
    });

    if (interval) {
      clearInterval(interval);
    }
    interval = setInterval(() => getApiAndEmit(socket), 1000);

    socket.on("disconnect", (reason) => {
      console.log("Client disconnected");
      socket.leave(socket.handshake.query.ProjectId);
      io.to(socket.handshake.query.ProjectId).emit(
        "status",
        `${user.username} has left`
      );
      clearInterval(interval);
    });
  } catch (e) {
    socket.emit("error", e.message);
    socket.disconnect();
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
    return User.verifyToken(token).UserId;
  } catch (e) {
    throw new Error(e.message);
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

/**
 * broadcast a update in a project to sockets in that project
 * @param {Object} project that has changed
 * @param {String} path path of update
 * @param {Object} body body to include in call
 */
const broadcastUpdate = (project, path, body) => {
  io.to(project.ProjectId).emit("update", { path, body });
};

const getApiAndEmit = (socket) => {
  const response = new Date();
  // Emitting a new message. Will be consumed by the client
  socket.emit("FromAPI", response);
};

module.exports = {
  connect,
};
