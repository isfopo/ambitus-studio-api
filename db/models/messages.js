"use strict";
const Sequelize = require("sequelize");

module.exports = (sequelize) => {
  class Message extends Sequelize.Model {}
  Message.init(
    {
      id: {
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.DataTypes.UUIDV1,
        primaryKey: true,
      },
      content: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
    },
    { sequelize }
  );

  Message.associate = (models) => {
    Message.hasOne(models.User);
    Message.hasOne(models.Project);
  };

  return Message;
};
