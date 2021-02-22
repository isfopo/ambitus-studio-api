const express = require("express");
const router = express.Router();
const Readable = require("stream").Readable;
const multer = require("multer");
const upload = multer({ dest: __dirname + "/temp/" });
const fs = require("fs");

const Project = require("./handlers/project");
const Scene = require("./handlers/scene");
const Track = require("./handlers/track");
const Clip = require("./handlers/clip");

/**
 * Create a new clip in a project (Authorization Bearer Required)
 * @route POST /clip
 * @group clip - Operations about clip
 * @param {string} projectId.body.required - containing project's id
 * @param {string} sceneId.body.required - containing project's id
 * @param {string} trackId.body.required - containing project's id
 * @param {string} name.body.optional - new clip's name
 * @param {integer} tempo.body.required - new clip's tempo
 * @param {string} time_signature.body.required - new clip's time signature
 * @param {integer} type.body.required - new clip's type
 * @returns {object} 200 - An object of clip's info with generated clip id
 * @returns {Error}  400 - Invalid token, name, tempo or time signature
 */
router.post("/", Project.authorize, async (req, res) => {
  try {
    const clipParameters = Clip.validatePost(req.body);

    const scene = await Scene.isInDatabase(req.body.sceneId);
    const track = await Track.isInDatabase(req.body.trackId);

    const clip = await scene.createClip({
      name: clipParameters.name,
      tempo: clipParameters.tempo,
      time_signature: clipParameters.time_signature,
      type: clipParameters.type, // TODO: do I need to have type for clip? would the track's type work?
    });

    await track.addClip(clip); // TODO: overwrite a clip with the same scene and track

    return res.status(200).json(clip);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

// TODO: maybe have a way to get clip by track and scene
router.get("/", Project.authorize, async (req, res) => {
  try {
    const clip = await Clip.findByPk(req.body.id);
    return res.status(200).json(clip);
  } catch (e) {
    return res.status(404).json(e);
  }
});

router.get("/content", Project.authorize, async (req, res) => {
  const clip = await Clip.isInDatabase(req.body.id);
  const stream = Readable.from(clip.content);

  stream.pipe(res);
});

router.put(
  "/name",
  Project.authorize,
  upload.single("content"),
  async (req, res) => {
    const clip = await User.findByPk(req.body.id);

    clip.name = req.body.name;
    await clip.save();

    res.status(200).json(clip);
  }
);

router.put(
  "/content",
  Project.authorize,
  upload.single("content"), // TODO: new clip must match tracks, mimetype and have tempo and time signature
  async (req, res) => {
    const clip = await Clip.isInDatabase(req.body.id);

    if ((clip.type = req.file.mimetype)) {
      const clipBuffer = fs.readFileSync(req.file.path);
      clip.content = clip;
      await clip.save();

      res.status(200).json(clip);
    } else {
      return res.status(400).json({
        error: "Clip type cannot be changed. Put clip in new track instead.",
      });
    }
  }
);

module.exports = router;
