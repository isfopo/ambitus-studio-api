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
      type: "audio/wav",
      index: 3,
    },
    {
      name: "Track4",
      type: "audio/wav",
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

router.get("/", async (req, res) => {
  //IDEA: add limit and offset
  const projects = await models.Project.findAll();

  const response = [];

  for (let i = 0; i < projects.length; i++) {
    const project = await Project.get(projects[i]);
    response.push({
      ProjectId: project.ProjectId,
      name: project.name,
      description: project.description,
      tempo: project.tempo,
      time_signature: project.time_signature,
    });
  }

  return res.status(200).json(response);
});

router.get("/detail", Project.authorize, async (req, res) => {
  const project = await Project.getDetail(req.project);
  return res.status(200).json(project);
});

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

router.get("/name", Project.authorize, async (req, res) => {
  res.status(200).json({ name: req.project.name });
});

router.get("/description", Project.authorize, async (req, res) => {
  res.status(200).json({ description: req.project.description });
});

router.get("/tempo", Project.authorize, async (req, res) => {
  res.status(200).json({ tempo: req.project.tempo });
});

router.get("/time_signature", Project.authorize, async (req, res) => {
  res.status(200).json({ time_signature: req.project.time_signature });
});

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
