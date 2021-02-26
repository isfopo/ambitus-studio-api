"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Track",
      [
        {
          TrackId: "d5656678-77c2-11eb-9439-0242ac130002",
          name: "MyFirstTrack",
          type: "audio/midi",
          ProjectId: "3a4639f8-77b6-11eb-9439-0242ac130002",
        },
        {
          TrackId: "d5656894-77c2-11eb-9439-0242ac130002",
          name: "MySecondTrack",
          type: "audio/wave",
          ProjectId: "3a4639f8-77b6-11eb-9439-0242ac130002",
        },
        {
          TrackId: "d565698e-77c2-11eb-9439-0242ac130002",
          name: "MyThirdTrack",
          type: "audio/midi",
          ProjectId: "3a4639f8-77b6-11eb-9439-0242ac130002",
        },
        {
          TrackId: "d5656b00-77c2-11eb-9439-0242ac130002",
          name: "MyAnotherTrack",
          type: "audio/ogg",
          ProjectId: "c563649c-77b7-11eb-9439-0242ac130002",
        },
        {
          TrackId: "d5656bdc-77c2-11eb-9439-0242ac130002",
          name: "DifferentTimeTrack",
          type: "audio/aac",
          ProjectId: "cfa8ba6a-77b7-11eb-9439-0242ac130002",
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Track", null, {});
  },
};
