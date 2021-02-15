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
    },
    { sequelize }
  );

  Project.associate = (models) => {
    Project.belongsToMany(models.User, { through: "UsersProjects" });
  };

  return Project;
};