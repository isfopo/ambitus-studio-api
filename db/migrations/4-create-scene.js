"use strict";
const path = require("path");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Scenes", {
      SceneId: {
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.DataTypes.UUIDV1,
        primaryKey: true,
      },
      name: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
      },
      tempo: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true,
        validate: {
          min: 40,
          max: 280,
        },
      },
      time_signature: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
      },
      bars: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 4,
      },
      repeats: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      index: {
        type: Sequelize.DataTypes.INTEGER,
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
    await queryInterface.dropTable("Scenes");
  },
};
