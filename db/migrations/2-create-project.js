"use strict";
const path = require("path");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Projects", {
      ProjectId: {
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.DataTypes.UUIDV1,
        primaryKey: true,
      },
      name: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      tempo: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 40,
          max: 280,
        },
      },
      time_signature: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      invited: {
        type: Sequelize.DataTypes.ARRAY(Sequelize.DataTypes.STRING),
        allowNull: false,
        defaultValue: [],
      },
      backlog: {
        type: Sequelize.DataTypes.ARRAY(Sequelize.DataTypes.JSON),
        allowNull: false,
        defaultValue: [],
      },
      frontlog: {
        type: Sequelize.DataTypes.ARRAY(Sequelize.DataTypes.JSON),
        allowNull: false,
        defaultValue: [],
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
    await queryInterface.dropTable("Projects");
  },
};