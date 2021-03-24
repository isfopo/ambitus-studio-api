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
    socket.join(socket.handshake.query.ProjectId);

    io.to(socket.handshake.query.ProjectId).emit("project", {
      project,
    });

    socket.on("disconnect", (reason) => {
      console.log("Client disconnected");
      socket.leave(socket.handshake.query.ProjectId);
      io.to(socket.handshake.query.ProjectId).emit(
        "status",
        `${user.username} has left`
      );
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

// TODO: put this function in all PUT routes in users, project, scenes, tracks, clips and messages
// use io and socket variables

/**
 * broadcast a update in a project to sockets in that project
 * @param {String} path path of update
 * @param {Object} body body to include in call  - must include ProjectId
 */
const broadcastUpdate = (path, body) => {
  if (io) {
    io.to(body.ProjectId).emit("update", { path, body });
  }
};

module.exports = {
  connect,
  broadcastUpdate,
};
