"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Scene",
      [
        {
          SceneId: "0e30ef4e-77bf-11eb-9439-0242ac130002",
          name: "MyFirstScene",
          ProjectId: "3a4639f8-77b6-11eb-9439-0242ac130002",
        },
        {
          SceneId: "0e30f354-77bf-11eb-9439-0242ac130002",
          name: "MySecondScene",
          ProjectId: "3a4639f8-77b6-11eb-9439-0242ac130002",
        },
        {
          SceneId: "0e30f462-77bf-11eb-9439-0242ac130002",
          name: "MyThirdScene",
          ProjectId: "3a4639f8-77b6-11eb-9439-0242ac130002",
        },
        {
          SceneId: "0e30f520-77bf-11eb-9439-0242ac130002",
          name: "MyAnotherScene",
          ProjectId: "c563649c-77b7-11eb-9439-0242ac130002",
        },
        {
          SceneId: "0e30f5d4-77bf-11eb-9439-0242ac130002",
          tempo: 120,
          time_signature: "5/4",
          name: "DifferentTimeScene",
          ProjectId: "cfa8ba6a-77b7-11eb-9439-0242ac130002",
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Scene", null, {});
  },
};
