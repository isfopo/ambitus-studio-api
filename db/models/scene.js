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
      },
      time_signature: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
      },
    },
    { sequelize }
  );

  return Scene;
};
