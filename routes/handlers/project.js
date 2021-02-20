const jwt = require("jsonwebtoken");

const validate = require("./helpers/validate");

const UserTable = require("../../db/models").User;
const ProjectTable = require("../../db/models").Project;

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
 * then authorize user for the requested project
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
            const project = await ProjectTable.findByPk(
              validate.id(req.body.id)
            );

            if (await project.hasUser(await UserTable.findByPk(user.id))) {
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

module.exports = {
  validatePost,
  authorize,
};
