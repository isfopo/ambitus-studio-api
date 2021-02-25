const express = require("express");
const router = express.Router();
const User = require("./handlers/user");
const Project = require("./handlers/project");

/**
 * Create a new project (Authorization Bearer Required)
 * @route POST /project
 * @group project - Operations about project
 * @param {string} name.body.required - new project's name
 * @param {integer} tempo.body.required - new project's tempo
 * @param {string} time_signature.body.required - new project's time signature
 * @returns {object} 200 - An object of project's info with generated project id
 * @returns {Error}  400 - Invalid token, name, tempo or time signature
 */
router.post("/", User.authorize, Project.post);

/**
 * Get project information (Authorization Bearer Required)
 * @route POST /project
 * @group project - Operations about project
 * @param {string} id.body.required - project's id
 * @returns {object} 200 - An object of project's info with generated project id
 * @returns {Error}  400 - Invalid token or id
 * @returns {Error}  403 - User is not in project
 * @returns {Error}  404 - Project not found
 */
router.get("/", Project.authorize, Project.get);

/**
 * Get all scenes from a project (Authorization Bearer Required)
 * @route GET /project/scenes
 * @group project - Operations about project
 * @param {string} id.body.required - project's id
 * @returns {object} 200 - An array of scenes in project
 * @returns {Error}  400 - Invalid token or id
 * @returns {Error}  403 - User is not in project
 * @returns {Error}  404 - Project not found
 */
router.get("/scenes", Project.authorize, Project.getScenes);

/**
 * Get all tracks from a project (Authorization Bearer Required)
 * @route GET /project/tracks
 * @group project - Operations about project
 * @param {string} id.body.required - project's id
 * @returns {object} 200 - An array of tracks in project
 * @returns {Error}  400 - Invalid token or id
 * @returns {Error}  403 - User is not in project
 * @returns {Error}  404 - Project not found
 */
router.get("/tracks", Project.authorize, Project.getTracks);

/**
 * Get all clips from a project (Authorization Bearer Required)
 * @route GET /project/clips
 * @group project - Operations about project
 * @param {string} id.body.required - project's id
 * @returns {object} 200 - An nested array of clips in project by scene
 * @returns {Error}  400 - Invalid token or id
 * @returns {Error}  403 - User is not in project
 * @returns {Error}  404 - Project not found
 */
router.get("/clips", Project.authorize, Project.getClips);

router.put("/invite", Project.authorize, Project.putInvite);

module.exports = router;
