const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const upload = multer({ dest: path.join(__dirname, "../" + "temp") });

const User = require("./handlers/user.js");

require("dotenv").config();

/**
 * Create a new user with a username and password
 * @route POST /user/
 * @group user - Operations about user
 * @param {string} username.body.required - new user's username
 * @param {string} password.body.required - new user's password
 * @returns {object} 200 - An object of user's info with generated user id
 * @returns {Error}  400 - Invalid or taken username or password
 */
router.post("/", User.post);

/**
 * Gets either all users or one user based on id or username
 * @route GET /user/
 * @group user - Operations about user
 * @param {string} id.body.optional - user's id
 * @param {string} username.body.optional - user's username
 * @returns {object} 200 - An object of user's info or an array of all users info
 * @returns {Error}  404 - User could not be found
 */
router.get("/", User.get);

/**
 * Get a JWT with a username and password
 * @route GET /user/login
 * @group user - Operations about user
 * @param {string} username.body.required - new user's username
 * @param {string} password.body.required - new user's password
 * @returns {object} 200 - a valid JSON Web Token
 * @returns {Error}  400 - Invalid or taken username or password
 */
router.get("/login", User.getLogin);

/**
 * Get an array of user's current projects by id (Authorization Bearer Required)
 * @route GET /user/projects
 * @group user - Operations about user
 * @param {string} id.body.required - user's id
 * @returns {object} 200 - User id and an array of project ids
 * @returns {Error}  400 - Invalid id
 */
router.get("/projects", User.authorize, User.getProjects);

/**
 * Get user's avatar
 * @route GET /user/projects
 * @group user - Operations about user
 * @param {string} id.body.required - user's id
 * @returns {object} 200 - user's avatar
 * @returns {Error}  400 - Invalid id
 */
router.get("/avatar", User.getAvatar);

/**
 * Change a user's username (Authorization Bearer Required)
 * @route PUT /user/username
 * @group user - Operations about user
 * @param {string} newName.body - user's newName
 * @returns {object} 200 - User id and changed name
 * @returns {Error}  400 - Invalid token, id or username
 */
router.put("/username", User.authorize, User.putUsername);

/**
 * Change a user's password (Authorization Bearer Required)
 * @route PUT /user/password
 * @group user - Operations about user
 * @param {string} newPassword.body - user's new password
 * @returns {object} 200 - User id
 * @returns {Error}  400 - Invalid token, id or password
 */
router.put("/password", User.authorize, User.putPassword);

/**
 * Change a user's avatar (Authorization Bearer Required)
 * @route PUT /user/avatar
 * @group user - Operations about user
 * @param {string} avatar.multipart - user's new avatar
 * @returns {object} 200 - User id and changed avatar path
 * @returns {Error}  400 - Invalid token or id
 * @returns {Error}  404 - Avatar image has been deleted - returns to default
 */
router.put("/avatar", User.authorize, upload.single("avatar"), User.putAvatar);

/**
 * Delete user (Authorization Bearer Required)
 * @route DELETE /user/
 * @group user - Operations about user
 * @returns {object} 204
 * @returns {Error}  400 - Invalid token or id
 */
router.delete("/", User.authorize, User.remove);

module.exports = router;
