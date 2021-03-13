"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Projects",
      [
        {
          ProjectId: "3a4639f8-77b6-11eb-9439-0242ac130002",
          name: "MyFirstProject",
          description: "This is our first project! Hope you like it!!",
          tempo: 120,
          time_signature: "4/4",
          invited: ["a568f290-76ec-11eb-be2c-750b4547c521"],
          requests: [""],
          backlog: [""],
          frontlog: [""],
        },
        {
          ProjectId: "c563649c-77b7-11eb-9439-0242ac130002",
          name: "MySecondProject",
          description: "Here our cool 5/4 song!",
          tempo: 150,
          time_signature: "5/4",
          invited: [""],
          requests: ["a568f290-76ec-11eb-be2c-750b4547c521"],
          backlog: [""],
          frontlog: [""],
        },
        {
          ProjectId: "cfa8ba6a-77b7-11eb-9439-0242ac130002",
          name: "MyThirdProject",
          description: "We're going to slow things down for this one!",
          tempo: 90,
          time_signature: "4/4",
          invited: [""],
          requests: [""],
          backlog: [""],
          frontlog: [""],
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Projects", null, {});
  },
};
