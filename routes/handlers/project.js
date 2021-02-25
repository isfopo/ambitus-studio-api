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
            const project = await findInDatabase(validate.id(req.body.id));

            if (await project.hasUser(await User.findByPk(user.id))) {
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
  const project = await Project.findByPk(id);

  if (project === null) {
    throw new Error("Couldn't find requested project in database");
  } else {
    return project;
  }
};

const post = async (req, res) => {
  try {
    const projectParameters = Project.validatePost(req.body);

    const project = await req.user.createProject({
      name: projectParameters.name,
      tempo: projectParameters.tempo,
      time_signature: projectParameters.time_signature,
    });

    return res.status(200).json(project);
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
};

const get = async (req, res) => {
  res.status(200).json(req.project);
};

const getScenes = async (req, res) => {
  const scenes = await req.project.getScenes();
  res.status(200).json(scenes);
};

const getTracks = async (req, res) => {
  const tracks = await req.project.getTracks();
  res.status(200).json(tracks);
};

const getClips = async (req, res) => {
  try {
    const scenes = await req.project.getScenes();

    // TODO: get clips for each scene

    const clips = scenes.map(async (scene) => {});

    res.status(200).json(clips);
  } catch (e) {
    res.status(400).json(e);
  }
};

const putInvite = async (req, res) => {
  try {
    const project = findByPk(req.body.id);
    project.invited.push(req.body.invitee); // TODO: check if invitee is in db
    await project.save();

    return res.status(200).json(project);
  } catch (e) {
    return res.status(400).json(e);
  }
};

module.exports = {
  validatePost,
  authorize,
  findInDatabase,
  post,
  get,
  getScenes,
  getTracks,
  getClips,
  putInvite,
};
