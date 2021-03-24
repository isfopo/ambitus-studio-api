const express = require("express");
const router = express.Router();
const validate = require("./handlers/helpers/validate");
const order = require("./handlers/helpers/order");
const models = require("../db/models");
const User = require("./handlers/user");
const Project = require("./handlers/project");
const Scene = require("./handlers/scene");
const Track = require("./handlers/track");
const Socket = require("./handlers/socket");

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
  const defaultScenes = [
    { name: "Scene1", index: 1 },
    { name: "Scene2", index: 2 },
    { name: "Scene3", index: 3 },
    { name: "Scene4", index: 4 },
  ];
  const defaultTracks = [
    {
      name: "Track1",
      type: "audio/midi",
      index: 1,
    },
    {
      name: "Track2",
      type: "audio/midi",
      index: 2,
    },
    {
      name: "Track3",
      type: "audio/wave",
      index: 3,
    },
    {
      name: "Track4",
      type: "audio/wave",
      index: 4,
    },
  ];

  try {
    const project = await Project.post(req.body, req.user);

    defaultScenes.forEach(async (scene) => {
      await Scene.createAndPopulate(project, scene);
    });

    defaultTracks.forEach(async (track) => {
      await Track.createAndPopulate(project, track);
    });

    return res.status(200).json(project);
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
});

/**
 * Gets non-sensitive data from all projects
 * @route GET /project
 * @group project - Operations about projects
 * @returns {Array} 200 - an array of all projects
 */
router.get("/", async (req, res) => {
  //IDEA: add limit and offset
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
 * Get th name of a project (Authorization Bearer Required)
 * @route GET /project/name
 * @group project - Operations about projects
 * @param {String} ProjectId.body.required - project's id
 * @returns {Object} 200 - name of project
 */
router.get("/name", Project.authorize, async (req, res) => {
  res.status(200).json({ name: req.project.name });
});

/**
 * Get the description of a project (Authorization Bearer Required)
 * @route GET /project/description
 * @group project - Operations about projects
 * @param {String} ProjectId.body.required - project's id
 * @returns {Object} 200 - description of project
 */
router.get("/description", Project.authorize, async (req, res) => {
  res.status(200).json({ description: req.project.description });
});

/**
 * Get the tempo of a project (Authorization Bearer Required)
 * @route GET /project/tempo
 * @group project - Operations about projects
 * @param {String} ProjectId.body.required - project's id
 * @returns {Object} 200 - tempo of project
 */
router.get("/tempo", Project.authorize, async (req, res) => {
  res.status(200).json({ tempo: req.project.tempo });
});

/**
 * Get the time signature of a project (Authorization Bearer Required)
 * @route GET /project/time_signature
 * @group project - Operations about projects
 * @param {String} ProjectId.body.required - project's id
 * @returns {Object} 200 - time_signature of project
 */
router.get("/time_signature", Project.authorize, async (req, res) => {
  res.status(200).json({ time_signature: req.project.time_signature });
});

/**
 * Change the tempo of a project (Authorization Bearer Required)
 * @route PUT /project/tempo
 * @group Project - Operations about projects
 * @param {String} ProjectId.body.required - project's id
 * @param {String} tempo.body.required - new project tempo
 * @returns {object} 204
 */
router.put("/name", Project.authorize, async (req, res) => {
  try {
    req.project.name = validate.name(req.body.name);
    await req.project.save();
    Socket.broadcastUpdate("/project/name", {
      ProjectId: req.project.ProjectId,
    });
    res.sendStatus(204);
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
});

/**
 * Change a project's description (Authorization Bearer Required)
 * @route PUT /project/description
 * @group project - Operations about project
 * @param {String} ProjectId.body.required - project's id
 * @param {String} description.body.optional - project's new description - if left empty, description is assigned null
 * @returns {Object} 204 - description has been changed
 */
router.put("/description", Project.authorize, async (req, res) => {
  try {
    req.project.description = req.body.description
      ? validate.description(req.body.description)
      : null;
    await req.project.save();
    Socket.broadcastUpdate("/project/description", {
      ProjectId: req.project.ProjectId,
    });
    return res.sendStatus(204);
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
});

/**
 * Change the tempo of a project (Authorization Bearer Required)
 * @route PUT /project/tempo
 * @group Project - Operations about projects
 * @param {String} ProjectId.body.required - project's id
 * @param {Number} tempo.body.required - new project tempo
 * @returns {object} 204
 */
router.put("/tempo", Project.authorize, async (req, res) => {
  try {
    req.project.tempo = validate.tempo(req.body.tempo);
    await req.project.save();
    Socket.broadcastUpdate("/project/tempo", {
      ProjectId: req.project.ProjectId,
    });
    res.sendStatus(204);
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
});

/**
 * Change the time signature of a project (Authorization Bearer Required)
 * @route PUT /project/time signature
 * @group Project - Operations about projects
 * @param {String} ProjectId.body.required - project's id
 * @param {String} time_signature.body.required - new project time signature
 * @returns {object} 204
 */
router.put("/time_signature", Project.authorize, async (req, res) => {
  try {
    req.project.time_signature = validate.timeSignature(
      req.body.time_signature
    );
    await req.project.save();
    Socket.broadcastUpdate("/project/time_signature", {
      ProjectId: req.project.ProjectId,
    });
    res.sendStatus(204);
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
});

/**
 * Put a UserId into invited array (Authorization Bearer Required)
 * @route PUT /project/invite
 * @group Project - Operations about projects
 * @param {String} ProjectId.body.required - project's id
 * @param {String} invitee.body.required - invitee's UserId
 * @returns {object} 204
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
 * @route PUT /project/reorder_scenes
 * @group Project - Operations about projects
 * @param {String} ProjectId.body.required - project's id
 * @param {String} SceneId.body.required - SceneId of scene to be moved
 * @param {Integer} index.body.required - index to insert scene
 */
router.put("/reorder_scenes", Project.authorize, async (req, res) => {
  const scenes = await req.project.getScenes();
  const reorderedScenes = order.reorderByProperty(
    scenes,
    "SceneId",
    req.body.SceneId,
    req.body.index
  );
  for (let i = 0; i < scenes.length; i++) {
    reorderedScenes[i].index = i;
    await reorderedScenes[i].save();
  }
  Socket.broadcastUpdate("/project/scenes", {
    ProjectId: req.project.ProjectId,
  });
  return res.status(200).json(reorderedScenes);
});

/**
 * Put a given track at a designated index (Authorization Bearer Required)
 * @route PUT /project/reorder_tracks
 * @group Project - Operations about projects
 * @param {String} ProjectId.body.required - project's id
 * @param {String} TrackId.body.required - TrackId of track to be moved
 * @param {Integer} index.body.required - index to insert track
 */
router.put("/reorder_tracks", Project.authorize, async (req, res) => {
  const tracks = await req.project.getTracks();
  const reorderedTracks = order.reorderByProperty(
    tracks,
    "TrackId",
    req.body.TrackId,
    req.body.index
  );
  for (let i = 0; i < tracks.length; i++) {
    reorderedTracks[i].index = i;
    await reorderedTracks[i].save();
  }
  Socket.broadcastUpdate("/project/tracks", {
    ProjectId: req.project.ProjectId,
  });
  return res.status(200).json(reorderedTracks);
});

module.exports = router;
