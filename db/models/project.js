"use strict";
const Sequelize = require("sequelize");

module.exports = (sequelize) => {
  class Project extends Sequelize.Model {}
  Project.init(
    {
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
        defaultValue: [],
        allowNull: false,
      },
      requests: {
        type: Sequelize.DataTypes.ARRAY(Sequelize.DataTypes.STRING),
        defaultValue: [],
        allowNull: false,
      },
      backlog: {
        type: Sequelize.DataTypes.ARRAY(Sequelize.DataTypes.STRING), // store backlog as compressed string
        defaultValue: [],
        allowNull: false,
      },
      frontlog: {
        type: Sequelize.DataTypes.ARRAY(Sequelize.DataTypes.STRING),
        defaultValue: [],
        allowNull: false,
      },
    },
    { sequelize }
  );

  Project.associate = (models) => {
    Project.belongsToMany(models.User, {
      through: "UsersProjects",
      foreignKey: "ProjectId",
    });
    Project.hasMany(models.Scene, { foreignKey: "ProjectId" });
    Project.hasMany(models.Track, { foreignKey: "ProjectId" });
    Project.hasMany(models.Message, { foreignKey: "ProjectId" });
  };

  return Project;
};
