"use strict";
const path = require("path");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Tracks", {
      TrackId: {
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.DataTypes.UUIDV1,
        primaryKey: true,
      },
      name: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
      },
      settings: {
        type: Sequelize.DataTypes.JSON,
        defaultValue: {},
        allowNull: false,
      },
      type: {
        type: Sequelize.DataTypes.ENUM,
        values: [
          "audio/aac",
          "audio/mpeg",
          "audio/ogg",
          "audio/webm",
          "audio/wave",
          "audio/midi",
        ],
        allowNull: false,
      },
      ProjectId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: "Projects",
          key: "ProjectId",
        },
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
    await queryInterface.dropTable("Tracks");
  },
};
