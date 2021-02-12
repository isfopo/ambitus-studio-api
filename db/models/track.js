"use strict";
const Sequelize = require("sequelize");

module.exports = (sequelize) => {
  class Track extends Sequelize.Model {}
  Track.init(
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
      settings: {
        type: Sequelize.DataTypes.JSON,
        allowNull: false,
      },
      type: {
        type: Sequelize.DataTypes.ENUM,
        values: ["audio", "midi"],
        allowNull: false,
      },
    },
    { sequelize }
  );

  return Track;
};
