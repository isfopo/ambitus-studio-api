const express = require("express");
const router = express.Router();
//const User = require("../db/models").User;

router.get("/", (res, req) => {
  req.status(200).json({ message: "you made it!" });
});

module.exports = router;
