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
          "audio/wav",
          "audio/midi",
        ],
        allowNull: false,
      },
      index: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
      },
    },
    { sequelize }
  );

  Track.associate = (models) => {
    Track.belongsTo(models.Project, { foreignKey: "TrackId" });
    Track.hasMany(models.Clip, { foreignKey: "TrackId" });
  };

  return Track;
};
