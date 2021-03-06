"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Scenes",
      [
        {
          SceneId: "0e30ef4e-77bf-11eb-9439-0242ac130002",
          name: "MyFirstScene",
          tempo: 120,
          time_signature: "4/4",
          index: 0,
          ProjectId: "3a4639f8-77b6-11eb-9439-0242ac130002",
        },
        {
          SceneId: "0e30f354-77bf-11eb-9439-0242ac130002",
          name: "MySecondScene",
          tempo: 120,
          time_signature: "4/4",
          index: 1,
          ProjectId: "3a4639f8-77b6-11eb-9439-0242ac130002",
        },
        {
          SceneId: "0e30f462-77bf-11eb-9439-0242ac130002",
          name: "MyThirdScene",
          tempo: 120,
          time_signature: "4/4",
          index: 2,
          ProjectId: "3a4639f8-77b6-11eb-9439-0242ac130002",
        },
        {
          SceneId: "0e30f520-77bf-11eb-9439-0242ac130002",
          name: "MyAnotherScene",
          tempo: 120,
          time_signature: "4/4",
          index: 0,
          ProjectId: "c563649c-77b7-11eb-9439-0242ac130002",
        },
        {
          SceneId: "0e30f5d4-77bf-11eb-9439-0242ac130002",
          tempo: 90,
          time_signature: "5/4",
          index: 0,
          name: "ADifferentTimeScene",
          ProjectId: "cfa8ba6a-77b7-11eb-9439-0242ac130002",
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Scenes", null, {});
  },
};
