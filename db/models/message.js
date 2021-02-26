"use strict";
const Sequelize = require("sequelize");

module.exports = (sequelize) => {
  class Message extends Sequelize.Model {}
  Message.init(
    {
      MessageId: {
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
    Message.belongsTo(models.User, { foreignKey: "MessageId" });
    Message.belongsTo(models.Project, { foreignKey: "MessageId" });
  };

  return Message;
};
