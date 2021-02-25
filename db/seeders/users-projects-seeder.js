"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "UsersProjects",
      [
        {
          ProjectId: "3a4639f8-77b6-11eb-9439-0242ac130002",
          UserId: "57fc1120-74d7-11eb-8c62-fdd5c8e05336",
        },
        {
          ProjectId: "3a4639f8-77b6-11eb-9439-0242ac130002",
          UserId: "4abcaff0-779e-11eb-83f3-bdec7a849d18",
        },
        {
          ProjectId: "c563649c-77b7-11eb-9439-0242ac130002",
          UserId: "4abcaff0-779e-11eb-83f3-bdec7a849d18",
        },
        {
          ProjectId: "c563649c-77b7-11eb-9439-0242ac130002",
          UserId: "a568f290-76ec-11eb-be2c-750b4547c521",
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("UsersProjects", null, {});
  },
};
