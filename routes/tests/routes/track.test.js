const assert = require("assert");
const Track = require("../../handlers/track");

describe("Track.validatePost", () => {
  describe("when body contains id, name, settings and type", () => {
    it("should return body", () => {
      const input = {
        id: "709ae450-7017-11eb-beda-e76c7ddac317",
        name: "MyTrack",
        settings: {
          delay_feedback: 32,
          gain: 46,
          mono: true,
        },
        type: "audio/midi",
      };
      const output = Track.validatePost(input);
      assert.deepStrictEqual(output, input);
    });
  });

  describe("when id is not present", () => {
    it("should throw an error", () => {
      const input = {
        name: "MyTrack",
        settings: {
          delay_feedback: 32,
          gain: 46,
          mono: true,
        },
        type: "audio/midi",
      };
      assert.throws(() => {
        const output = Track.validatePost(input);
      });
    });
  });

  describe("when name is not present", () => {
    it("should throw an error", () => {
      const input = {
        id: "709ae450-7017-11eb-beda-e76c7ddac317",
        settings: {
          delay_feedback: 32,
          gain: 46,
          mono: true,
        },
        type: "audio/midi",
      };
      assert.throws(() => {
        const output = Track.validatePost(input);
      });
    });
  });

  describe("when settings are not present", () => {
    it("should throw an error", () => {
      const input = {
        id: "709ae450-7017-11eb-beda-e76c7ddac317",
        name: "MyTrack",
        type: "audio/midi",
      };
      assert.throws(() => {
        const output = Track.validatePost(input);
      });
    });
  });

  describe("when type is not present", () => {
    it("should throw an error", () => {
      const input = {
        id: "709ae450-7017-11eb-beda-e76c7ddac317",
        name: "MyTrack",
        settings: {
          delay_feedback: 32,
          gain: 46,
          mono: true,
        },
      };
      assert.throws(() => {
        const output = Track.validatePost(input);
      });
    });
  });

  describe("when id is not a valid uuid", () => {
    it("should throw an error", () => {
      const input = {
        id: "123456789abcdef",
        name: "MyTrack",
        settings: {
          delay_feedback: 32,
          gain: 46,
          mono: true,
        },
        type: "audio/midi",
      };
      assert.throws(() => {
        const output = Track.validatePost(input);
      });
    });
  });

  describe("when name is not a valid name", () => {
    it("should throw an error", () => {
      const input = {
        id: "709ae450-7017-11eb-beda-e76c7ddac317",
        name: "hi",
        settings: {
          delay_feedback: 32,
          gain: 46,
          mono: true,
        },
        type: "audio/midi",
      };
      assert.throws(() => {
        const output = Track.validatePost(input);
      });
    });
  });

  describe("when settings is not valid settings", () => {
    it("should throw an error", () => {
      const input = {
        id: "709ae450-7017-11eb-beda-e76c7ddac317",
        name: "MyTrack",
        settings: "delay",
        type: "audio/midi",
      };
      assert.throws(() => {
        const output = Track.validatePost(input);
      });
    });
  });

  describe("when type is not a valid type", () => {
    it("should throw an error", () => {
      const input = {
        id: "709ae450-7017-11eb-beda-e76c7ddac317",
        name: "MyTrack",
        settings: {
          delay_feedback: 32,
          gain: 46,
          mono: true,
        },
        type: "text/plain",
      };
      assert.throws(() => {
        const output = Track.validatePost(input);
      });
    });
  });
});
