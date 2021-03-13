"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Clips",
      [
        {
          ClipId: "9541f1d6-81c4-11eb-8dcd-0242ac130003",
          name: "scene1track1",
          tempo: 120,
          time_signature: "4/4",
          content: "",
          SceneId: "0e30ef4e-77bf-11eb-9439-0242ac130002",
          TrackId: "d5656678-77c2-11eb-9439-0242ac130002",
        },
        {
          ClipId: "9541f546-81c4-11eb-8dcd-0242ac130003",
          name: "scene1track2",
          tempo: 120,
          time_signature: "4/4",
          SceneId: "0e30ef4e-77bf-11eb-9439-0242ac130002",
          TrackId: "d5656894-77c2-11eb-9439-0242ac130002",
        },
        {
          ClipId: "9541f640-81c4-11eb-8dcd-0242ac130003",
          name: "scene1track3",
          tempo: 120,
          time_signature: "4/4",
          SceneId: "0e30ef4e-77bf-11eb-9439-0242ac130002",
          TrackId: "d565698e-77c2-11eb-9439-0242ac130002",
        },
        {
          ClipId: "9541f708-81c4-11eb-8dcd-0242ac130003",
          name: "scene2track1",
          tempo: 120,
          time_signature: "4/4",
          SceneId: "0e30f354-77bf-11eb-9439-0242ac130002",
          TrackId: "d5656678-77c2-11eb-9439-0242ac130002",
        },
        {
          ClipId: "9541f7c6-81c4-11eb-8dcd-0242ac130003",
          name: "scene2track2",
          tempo: 120,
          time_signature: "4/4",
          SceneId: "0e30f354-77bf-11eb-9439-0242ac130002",
          TrackId: "d5656894-77c2-11eb-9439-0242ac130002",
        },
        {
          ClipId: "9541f884-81c4-11eb-8dcd-0242ac130003",
          name: "scene2track3",
          tempo: 120,
          time_signature: "4/4",
          SceneId: "0e30f354-77bf-11eb-9439-0242ac130002",
          TrackId: "d565698e-77c2-11eb-9439-0242ac130002",
        },
        {
          ClipId: "9541fabe-81c4-11eb-8dcd-0242ac130003",
          name: "scene3track1",
          tempo: 120,
          time_signature: "4/4",
          SceneId: "0e30f462-77bf-11eb-9439-0242ac130002",
          TrackId: "d5656678-77c2-11eb-9439-0242ac130002",
        },
        {
          ClipId: "9541fb72-81c4-11eb-8dcd-0242ac130003",
          name: "scene3track2",
          tempo: 120,
          time_signature: "4/4",
          SceneId: "0e30f462-77bf-11eb-9439-0242ac130002",
          TrackId: "d5656894-77c2-11eb-9439-0242ac130002",
        },
        {
          ClipId: "9541fc30-81c4-11eb-8dcd-0242ac130003",
          name: "scene3track2",
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
