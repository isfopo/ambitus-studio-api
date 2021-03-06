"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Tracks",
      [
        {
          TrackId: "d5656678-77c2-11eb-9439-0242ac130002",
          name: "MyFirstTrack",
          type: "audio/midi",
          index: 0,
          ProjectId: "3a4639f8-77b6-11eb-9439-0242ac130002",
        },
        {
          TrackId: "d5656894-77c2-11eb-9439-0242ac130002",
          name: "MySecondTrack",
          type: "audio/wave",
          index: 1,
          ProjectId: "3a4639f8-77b6-11eb-9439-0242ac130002",
        },
        {
          TrackId: "d565698e-77c2-11eb-9439-0242ac130002",
          name: "MyThirdTrack",
          type: "audio/midi",
          index: 2,
          ProjectId: "3a4639f8-77b6-11eb-9439-0242ac130002",
        },
        {
          TrackId: "d5656b00-77c2-11eb-9439-0242ac130002",
          name: "MyAnotherTrack",
          type: "audio/ogg",
          index: 0,
          ProjectId: "c563649c-77b7-11eb-9439-0242ac130002",
        },
        {
          TrackId: "d5656bdc-77c2-11eb-9439-0242ac130002",
          name: "DifferentTimeTrack",
          type: "audio/aac",
          index: 0,
          ProjectId: "cfa8ba6a-77b7-11eb-9439-0242ac130002",
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Tracks", null, {});
  },
};
