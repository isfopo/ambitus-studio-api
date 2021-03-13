"use strict";
const path = require("path");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Users", {
      UserId: {
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
      bio: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
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
      createdAt: {
        type: Sequelize.DataTypes.DATE,
        defaultValue: Date.now(),
      },
      updatedAt: {
        type: Sequelize.DataTypes.DATE,
        defaultValue: Date.now(),
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Users");
  },
};
