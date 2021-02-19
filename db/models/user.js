"use strict";
const Sequelize = require("sequelize");

module.exports = (sequelize) => {
  class User extends Sequelize.Model {}
  User.init(
    {
      id: {
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.DataTypes.UUIDV1,
        primaryKey: true,
      },
      username: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        // TODO: hash this pass
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      avatar: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true, //TODO: add a default path to a default avatar
      },
    },
    { sequelize }
  );

  User.associate = (models) => {
    User.belongsToMany(models.Project, { through: "UsersProjects" });
    User.hasMany(models.Message);
  };

  return User;
};
