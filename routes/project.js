const express = require("express");
const router = express.Router();
const validate = require("./handlers/helpers/validate");
const order = require("./handlers/helpers/order");
const models = require("../db/models");
const User = require("./handlers/user");
const Project = require("./handlers/project");

/**
 * Create a new project (Authorization Bearer Required)
 * @route POST /project
 * @group project - Operations about projects
 * @param {string} name.body.required - new project's name
 * @param {integer} tempo.body.required - new project's tempo
 * @param {string} time_signature.body.required - new project's time signature
 * @returns {object} 200 - An object of project's info with generated project id
 * @returns {Error}  400 - Invalid token, name, tempo or time signature
 */
router.post("/", User.authorize, async (req, res) => {
  try {
    const project = await Project.post(req.body);
    return res.status(200).json(project);
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
});

router.get("/", async (req, res) => {
  const projects = await models.Project.findAll();

  const response = [];

  for (let i = 0; i < projects.length; i++) {
    response.push(await Project.get(projects[i]));
  }

  return res.status(200).json(response);
});

/**
 * Get project information (Authorization Bearer Required)
 * @route POST /project/detail
 * @group project - Operations about projects
 * @param {string} ProjectId.body.required - project's id
 * @returns {object} 200 - An object of project's info with generated project id
 * @returns {Error}  400 - Invalid token or id
 * @returns {Error}  403 - User is not in project
 * @returns {Error}  404 - Project not found
 */
router.get("/detail", Project.authorize, async (req, res) => {
  const project = await Project.getDetail(req.project);
  return res.status(200).json(project);
});

/**
 * Get all users in project (Authorization Bearer Required)
 * @route POST /project/users
 * @group project - Operations about projects
 * @param {string} ProjectId.body.required - project's id
 * @returns {object} 200 - An array of users in project
 * @returns {Error}  400 - Invalid token or id
 * @returns {Error}  403 - User is not in project
 * @returns {Error}  404 - Project not found
 */
router.get("/users", Project.authorize, async (req, res) => {
  const users = await req.project.getUsers();
  return res.status(200).json(
    users.map((user) => {
      return {
        UserId: user.UserId,
        username: user.username,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    })
  );
});

/**
 * Get all scenes from a project (Authorization Bearer Required)
 * @route GET /project/scenes
 * @group project - Operations about projects
 * @param {String} ProjectId.body.required - project's id
 * @returns {object} 200 - An array of scenes in project
 * @returns {Error}  400 - Invalid token or id
 * @returns {Error}  403 - User is not in project
 * @returns {Error}  404 - Project not found
 */
router.get("/scenes", Project.authorize, async (req, res) => {
  const scenes = await req.project.getScenes();
  res.status(200).json(
    scenes.map((scene) => {
      return {
        SceneId: scene.SceneId,
        name: scene.name,
        tempo: scene.tempo,
        time_signature: scene.time_signature,
        createdAt: scene.createdAt,
        updatedAt: scene.updatedAt,
      };
    })
  );
});

/**
 * Get all tracks from a project (Authorization Bearer Required)
 * @route GET /project/tracks
 * @group project - Operations about projects
 * @param {String} ProjectId.body.required - project's id
 * @returns {object} 200 - An array of tracks in project
 * @returns {Error}  400 - Invalid token or id
 * @returns {Error}  403 - User is not in project
 * @returns {Error}  404 - Project not found
 */
router.get("/tracks", Project.authorize, async (req, res) => {
  const tracks = await req.project.getTracks();
  res.status(200).json(
    tracks.map((track) => {
      return {
        TrackId: track.TrackId,
        name: track.name,
        settings: track.settings,
        type: track.type,
        createdAt: track.createdAt,
        updatedAt: track.updatedAt,
      };
    })
  );
});

/**
 * Get all clips from a project (Authorization Bearer Required)
 * @route GET /project/clips
 * @group project - Operations about projects
 * @param {String} ProjectId.body.required - project's id
 * @returns {object} 200 - An nested array of clips in project by scene
 * @returns {Error}  400 - Invalid token or id
 * @returns {Error}  403 - User is not in project
 * @returns {Error}  404 - Project not found
 */
router.get("/clips", Project.authorize, async (req, res) => {
  try {
    const scenes = await req.project.getScenes();

    // TODO: get clips for each scene

    const clips = scenes.map(async (scene) => {});

    res.status(200).json(clips);
  } catch (e) {
    res.status(400).json(e);
  }
});

/**
 * Get all message (Authorization Bearer Required)
 * @route POST /project/messages
 * @group project - Operations about projects
 * @param {String} ProjectId.body.required - project's id
 * @returns {object} 200 - An array of messages in project
 * @returns {Error}  400 - Invalid token or id
 * @returns {Error}  403 - User is not in project
 * @returns {Error}  404 - Project not found
 */
router.get("/messages", Project.authorize, async (req, res) => {
  const messages = await req.project.getMessages();
  res.status(200).json(messages);
});

/**
 * Put a UserId into invited array (Authorization Bearer Required)
 * @route PUT /project/invite
 * @group Project - Operations about projects
 * @param {String} ProjectId.body.required - project's id
 * @param {String} invitee.body.required - invitee's UserId
 * @returns {object} 204
 * @returns {Error}  400 - Invalid token or id
 * @returns {Error}  403 - User is not in project
 * @returns {Error}  404 - Project not found
 */
router.put("/invite", Project.authorize, async (req, res) => {
  try {
    const users = await req.project.getUsers();

    if (!users.map((user) => user.UserId).includes(req.body.invitee)) {
      req.project.invited = [
        ...req.project.invited,
        validate.id(req.body.invitee),
      ];
      await req.project.save();

      return res.sendStatus(204);
    } else {
      return res.status(400).json({ error: ["user is already in project"] });
    }
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
});

/**
 * Requests access to a given project (Authorization Bearer Required)
 * @route PUT /project/request
 * @group Projects - Operations about projects
 * @param {String} ProjectId.body.required - requested project's ids
 * @returns {Object} 204
 */
router.put("/request", User.authorize, async (req, res) => {
  try {
    const project = await models.Project.findByPk(req.body.ProjectId);
    const users = await project.getUsers();

    if (!users.map((user) => user.UserId).includes(req.user.UserId)) {
      req.project.requests = [
        ...req.project.requests,
        validate.id(req.user.UserId),
      ];
      await req.project.save();

      return res.sendStatus(204);
    } else {
      return res.status(400).json({ error: ["user is already in project"] });
    }
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
});

/**
 * Accepts request from a user to join a project (Authorization Bearer Required)
 * @route PUT /project/accept
 * @group Project - Operations about projects
 * @param {String} ProjectId.body.required - project's id
 * @param {String} requester.body.required - requesting user's UserId
 */
router.put("/accept", Project.authorize, async (req, res) => {
  try {
    const requester = await User.findInDatabase(req.body.requester);

    if (req.project.requests.includes(requester.UserId)) {
      req.project.requests = req.project.requests.filter(
        (id) => id !== requester.UserId
      );
      await req.project.save();

      await req.project.addUser(requester);
      return res.sendStatus(204);
    } else {
      return res
        .status(400)
        .json({ error: ["user has not requested this project"] });
    }
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

/**
 * Put a given scene at a designated index (Authorization Bearer Required)
 * @route PUT /project/accept
 * @group Project - Operations about projects
 * @param {String} ProjectId.body.required - project's id
 * @param {String} SceneId.body.required - SceneId of scene to be moved
 * @param {Integer} index.body.required - index to insert scene
 */
router.put("/reorder-scenes", Project.authorize, async (req, res) => {
  const scenes = await req.project.getScenes();

  // BUG: almost works, will insert at correct index, but will sometimes order other elements incorrectly
  const reorderedScenes = order.reorderByProperty(
    scenes,
    "SceneId",
    req.body.SceneId,
    req.body.index
  );
  // assign index to scenes in array
  for (let i = 0; i < scenes.length; i++) {
    reorderedScenes[i].index = i;
    await reorderedScenes[i].save();
  }
  return res.status(200).json(reorderedScenes);
});

module.exports = router;
