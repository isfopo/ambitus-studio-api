"use strict";
const Sequelize = require("sequelize");

module.exports = (sequelize) => {
  class User extends Sequelize.Model {}
  User.init(
    {
      username: Sequelize.STRING,
    },
    { sequelize }
  );

  return User;
};
