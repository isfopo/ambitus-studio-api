"use strict";
const Sequelize = require("sequelize");

module.exports = (sequelize) => {
  class Scene extends Sequelize.Model {}
  Scene.init(
    {
      id: {
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
    },
    { sequelize }
  );

  Scene.associate = (models) => {
    Scene.hasOne(models.Project);
  };

  return Scene;
};
