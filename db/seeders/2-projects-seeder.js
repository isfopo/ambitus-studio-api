"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Projects",
      [
        {
          ProjectId: "3a4639f8-77b6-11eb-9439-0242ac130002",
          name: "MyFirstProject",
          tempo: 120,
          time_signature: "4/4",
          // invited: [],
          // backlog: [],
          // frontlog: [],
        },
        {
          ProjectId: "c563649c-77b7-11eb-9439-0242ac130002",
          name: "MySecondProject",
          tempo: 150,
          time_signature: "5/4",
          // invited: [],
          // backlog: [],
          // frontlog: [],
        },
        {
          ProjectId: "cfa8ba6a-77b7-11eb-9439-0242ac130002",
          name: "MyThirdProject",
          tempo: 90,
          time_signature: "4/4",
          // invited: [],
          // backlog: [],
          // frontlog: [],
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Projects", null, {});
  },
};
