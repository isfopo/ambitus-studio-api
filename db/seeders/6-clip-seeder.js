"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Clips",
      [
        {
          ClipId: "d5656678-77c2-11eb-9439-0242ac130002",
          name: "MyFirstClip",
          tempo: 120,
          time_signature: "4/4",
          SceneId: "0e30ef4e-77bf-11eb-9439-0242ac130002",
          TrackId: "d5656678-77c2-11eb-9439-0242ac130002",
        },
        {
          ClipId: "d5656894-77c2-11eb-9439-0242ac130002",
          name: "MySecondClip",
          tempo: 120,
          time_signature: "4/4",
          SceneId: "0e30ef4e-77bf-11eb-9439-0242ac130002",
          TrackId: "d5656894-77c2-11eb-9439-0242ac130002",
        },
        {
          ClipId: "d565698e-77c2-11eb-9439-0242ac130002",
          name: "MyThirdClip",
          tempo: 120,
          time_signature: "4/4",
          SceneId: "0e30f354-77bf-11eb-9439-0242ac130002",
          TrackId: "d5656894-77c2-11eb-9439-0242ac130002",
        },
        {
          ClipId: "d5656b00-77c2-11eb-9439-0242ac130002",
          name: "AnotherClip",
          tempo: 120,
          time_signature: "4/4",
          SceneId: "0e30f462-77bf-11eb-9439-0242ac130002",
          TrackId: "d565698e-77c2-11eb-9439-0242ac130002",
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Clips", null, {});
  },
};
