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
router.post("/", Project.authorize, Clip.post);

// TODO: maybe have a way to get clip by track and scene
router.get("/", Project.authorize, Clip.get);

router.get("/content", Project.authorize, Clip.getContent);

router.put("/name", Project.authorize, upload.single("content"), Clip.putName);

router.put(
  "/content",
  Project.authorize,
  upload.single("content"),
  Clip.putContent
);
// TODO: new clip must match tracks, mimetype and have tempo and time signature
module.exports = router;
