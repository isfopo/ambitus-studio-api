"use strict";
const Sequelize = require("sequelize");
const path = require("path");

module.exports = (sequelize) => {
  class User extends Sequelize.Model {}
  User.init(
    {
      UserId: {
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
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      bio: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
      },
      avatar: {
        type: Sequelize.DataTypes.STRING,
        defaultValue: path.join(
          __dirname,
          "../../" + "assets/images/default-avatar.jpg"
        ),
        allowNull: false,
      },
      avatar_type: {
        type: Sequelize.DataTypes.STRING,
        defaultValue: "image/jpeg",
        allowNull: false,
      },
    },
    { sequelize }
  );

  User.associate = (models) => {
    User.belongsToMany(models.Project, {
      through: "UsersProjects",
      foreignKey: "UserId",
    });
    User.hasMany(models.Message, { foreignKey: "UserId" });
  };

  return User;
};
