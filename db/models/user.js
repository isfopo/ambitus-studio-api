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
      avatar: {
        type: Sequelize.DataTypes.BLOB("long"),
        allowNull: true,
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
