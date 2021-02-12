"use strict";
const Sequelize = require("sequelize");

module.exports = (sequelize) => {
  class Project extends Sequelize.Model {}
  Project.init(
    {
      id: {
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.DataTypes.UUIDV1,
        primaryKey: true,
      },
      name: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      tempo: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
      },
      tempo: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
    },
    { sequelize }
  );

  return Project;
};
