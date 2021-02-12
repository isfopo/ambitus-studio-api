"use strict";
const Sequelize = require("sequelize");

module.exports = (sequelize) => {
  class Clip extends Sequelize.Model {}
  Clip.init(
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
        allowNull: false,
      },
      time_signature: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      content: {
        type: Sequelize.DataTypes.BLOB,
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

  return Clip;
};
