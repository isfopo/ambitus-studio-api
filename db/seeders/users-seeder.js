"use strict";
const User = require("../../routes/handlers/user");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Users",
      [
        {
          UserId: "57fc1120-74d7-11eb-8c62-fdd5c8e05336",
          username: "isfopo",
          password: await User.hashValidPassword("te$tPa55word"),
          avatar:
            "/Users/isaacpoole/Current Projects/ambitus-studio-api/assets/images/default-avatar.jpeg",
          avatar_type: "image/jpeg",
        },
        {
          UserId: "4abcaff0-779e-11eb-83f3-bdec7a849d18",
          username: "jim",
          password: await User.hashValidPassword("te$tPa55word"),
          avatar:
            "/Users/isaacpoole/Current Projects/ambitus-studio-api/assets/images/default-avatar.jpeg",
          avatar_type: "image/jpeg",
        },
        {
          UserId: "a568f290-76ec-11eb-be2c-750b4547c521",
          username: "bobby",
          password: await User.hashValidPassword("te$tPa55word"),
          avatar:
            "/Users/isaacpoole/Current Projects/ambitus-studio-api/assets/images/default-avatar.jpeg",
          avatar_type: "image/jpeg",
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
