"use strict";
const Sequelize = require("sequelize");

module.exports = (sequelize) => {
  class Clip extends Sequelize.Model {}
  Clip.init(
    {
      ClipId: {
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
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
      },
    },
    { sequelize }
  );

  Clip.associate = (models) => {
    Clip.belongsTo(models.Scene, { foreignKey: "ClipId" });
    Clip.belongsTo(models.Track, { foreignKey: "ClipId" });
  };

  return Clip;
};
