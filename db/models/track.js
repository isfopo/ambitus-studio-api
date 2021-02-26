"use strict";
const Sequelize = require("sequelize");

module.exports = (sequelize) => {
  class Track extends Sequelize.Model {}
  Track.init(
    {
      TrackId: {
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.DataTypes.UUIDV1,
        primaryKey: true,
      },
      name: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      settings: {
        type: Sequelize.DataTypes.JSON,
        defaultValue: {},
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

  Track.associate = (models) => {
    Track.belongsTo(models.Project);
    Track.hasMany(models.Clip);
  };

  return Track;
};
