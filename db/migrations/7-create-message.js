"use strict";
const path = require("path");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Messages", {
      MessageId: {
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.DataTypes.UUIDV1,
        primaryKey: true,
      },
      content: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      UserId: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: "Users",
          key: "UserId",
        },
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
    await queryInterface.dropTable("Messages");
  },
};
