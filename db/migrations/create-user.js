"use strict";
const path = require("path");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Users", {
      id: {
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.DataTypes.UUIDV1,
        primaryKey: true,
      },
      username: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      avatar: {
        type: Sequelize.DataTypes.STRING,
        defaultValue: path.join(
          __dirname,
          "../../" + "assets/images/default-avatar.jpg"
        ),
        allowNull: false,
      },
      avatar_type: {
        type: Sequelize.DataTypes.STRING,
        defaultValue: "image/jpeg",
        allowNull: false,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Users");
  },
};
