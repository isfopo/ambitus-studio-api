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
        validate: {
          min: 40,
          max: 280,
        },
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
        values: [
          "audio/aac",
          "audio/mpeg",
          "audio/ogg",
          "audio/webm",
          "audio/wave",
          "audio/midi",
        ],
        allowNull: false,
      },
    },
    { sequelize }
  );

  Clip.associate = (models) => {
    Clip.hasOne(models.Scene);
    Clip.hasOne(models.Track);
  };

  return Clip;
};
