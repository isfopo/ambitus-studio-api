"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Messages",
      [
        {
          MessageId: "7e7bc8a8-77ee-11eb-9439-0242ac130002",
          content: "Hi",
          UserId: "4abcaff0-779e-11eb-83f3-bdec7a849d18",
          ProjectId: "3a4639f8-77b6-11eb-9439-0242ac130002",
        },
        {
          MessageId: "7e7bcc9a-77ee-11eb-9439-0242ac130002",
          content: "hello!!",
          UserId: "57fc1120-74d7-11eb-8c62-fdd5c8e05336",
          ProjectId: "3a4639f8-77b6-11eb-9439-0242ac130002",
        },
        {
          MessageId: "7e7bcd9e-77ee-11eb-9439-0242ac130002",
          content: "sounds good",
          UserId: "4abcaff0-779e-11eb-83f3-bdec7a849d18",
          ProjectId: "3a4639f8-77b6-11eb-9439-0242ac130002",
        },
        {
          MessageId: "7e7bce70-77ee-11eb-9439-0242ac130002",
          content: "groove it!",
          UserId: "4abcaff0-779e-11eb-83f3-bdec7a849d18",
          ProjectId: "c563649c-77b7-11eb-9439-0242ac130002",
        },
        {
          MessageId: "7e7bcf2e-77ee-11eb-9439-0242ac130002",
          content: "I like that!",
          UserId: "a568f290-76ec-11eb-be2c-750b4547c521",
          ProjectId: "c563649c-77b7-11eb-9439-0242ac130002",
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Messages", null, {});
  },
};
