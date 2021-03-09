const jwt = require("jsonwebtoken");

const validate = require("./helpers/validate");

const User = require("../../db/models").User;
const Project = require("../../db/models").Project;

const validatePost = (body = {}) => {
  const errors = [];

  if (!body.name) {
    errors.push("body should contain a name");
  } else if (!body.tempo) {
    errors.push("body should contain a tempo");
  } else if (!body.time_signature) {
    errors.push("body should contain a time signature");
  }

  try {
    validate.name(body.name);
    validate.tempo(body.tempo);
    validate.timeSignature(body.time_signature);
  } catch (e) {
    errors.push(e.message);
  }

  if (errors.length > 0) {
    throw errors;
  } else {
    return body;
  }
};

/**
 * middleware that will check and parse token authentication header assigning user id and name to req.user
 * then authorize user for the requested project and assigns project to req.project
 * @param {request} req express request Object
 * @param {response} res express response object
 * @param {next} next express callback function
 */
const authorize = (req, res, next) => {
  //TODO: refactor
  const header = req.headers["authorization"];

  if (typeof header !== "undefined") {
    const bearer = header.split(" ");
    const token = bearer[1];

    jwt.verify(token, process.env.JWT_SECRET, async (error, user) => {
      if (error) {
        return res.status(403).json({ error: ["token not authorized"] });
      } else {
        if (user.exp < Date.now()) {
          try {
            req.user = user;
            const project = await findInDatabase(
              validate.id(req.body.ProjectId)
            );

            if (await project.hasUser(await User.findByPk(user.UserId))) {
              req.project = project;
              next();
            } else {
              return res.status(403).json({
                error: ["user is not authorized to use this project"],
              });
            }
          } catch (e) {
            return res.status(400).json({ error: e.message });
          }
        } else {
          return res.status(403).json({ error: ["token has expired"] });
        }
      }
    });
  } else {
    return res.status(403).json({ error: ["token not present"] });
  }
};

/**
 * determines if given project id is present in database
 * @param {string} id the id of the project to be found
 * @returns {boolean} if the project is found
 */
const findInDatabase = async (id = "") => {
  const project = await Project.findByPk(validate.id(id));

  if (project === null) {
    throw new Error("Couldn't find requested project in database");
  } else {
    return project;
  }
};

/**
 * Validates and creates a new project in the database
 * @param {Object} body request body with project info
 * @param {Object} user user object from req.user
 * @returns {Object} project
 */
const post = async (body = {}, user = {}) => {
  const projectParameters = validatePost(body);

  const project = await user.createProject({
    name: projectParameters.name,
    tempo: projectParameters.tempo,
    time_signature: projectParameters.time_signature,
  });

  return project;
};

/**
 * Takes a project and returns info, users' ids
 * Shows enough for public display
 * @param {Object} project object to get users, scenes and tracks of
 * @returns {Object} all info, users, scenes and tracks of project
 */
const get = async (project = {}) => {
  const users = await project.getUsers();
  return {
    ...project.dataValues,
    users: users.map((user) => user.UserId),
  };
};

/**
 * Takes a project and returns all info, users, scenes and tracks
 * For detailed information only needed for users in project
 * @param {Object} project object to get users, scenes and tracks of
 * @returns {Object} all info, users, scenes and tracks of project
 */
const getDetail = async (project = {}) => {
  const users = await project.getUsers();
  const scenes = await project.getScenes();
  const tracks = await project.getTracks();
  return {
    ...project.dataValues,
    users: users.map((user) => user.UserId),
    scenes: scenes.map((scene) => scene.SceneId),
    tracks: tracks.map((track) => track.TrackId),
  };
};

/**
 * removes a given user from the project
 * @param {Object} user object from database
 * @param {Object} project object from database
 */
const leave = async (user, project) => {
  await project.removeUser(user);
  const usersLeftInProject = await project.getUsers();
  if (usersLeftInProject.length === 0) {
    await project.destroy();
  }
};

module.exports = {
  validatePost,
  authorize,
  findInDatabase,
  post,
  get,
  getDetail,
  leave,
};
