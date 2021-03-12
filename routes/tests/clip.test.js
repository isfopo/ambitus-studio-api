const assert = require("assert");
const Clip = require("../handlers/clip");

describe("Clip.validatePost", () => {
  describe("when body contains valid SceneId, TrackId, name, tempo and time signature", () => {
    it("returns body", () => {
      const input = {
        SceneId: "0e30ef4e-77bf-11eb-9439-0242ac130002",
        TrackId: "d5656678-77c2-11eb-9439-0242ac130002",
        type: "audio/midi",
        name: "MyClip",
        tempo: 120,
        time_signature: "4/4",
      };
      const output = Clip.validatePost(input);
      assert.deepStrictEqual(output, input);
    });
  });

  describe("when body does not contain an id", () => {
    it("should throw an error", () => {
      const input = {
        name: "MyClip",
        tempo: 120,
        time_signature: "4/4",
      };
      assert.throws(() => {
        const output = Clip.validatePost(input);
      });
    });
  });

  describe("when body does not contain a name", () => {
    it("should throw an error", () => {
      const input = {
        SceneId: "0e30ef4e-77bf-11eb-9439-0242ac130002",
        TrackId: "d5656678-77c2-11eb-9439-0242ac130002",
        tempo: 120,
        time_signature: "4/4",
      };
      assert.throws(() => {
        const output = Clip.validatePost(input);
      });
    });
  });

  describe("when body does not contain a tempo", () => {
    it("should throw an error", () => {
      const input = {
        SceneId: "0e30ef4e-77bf-11eb-9439-0242ac130002",
        TrackId: "d5656678-77c2-11eb-9439-0242ac130002",
        name: "MyClip",
        time_signature: "4/4",
      };
      assert.throws(() => {
        const output = Clip.validatePost(input);
      });
    });
  });

  describe("when body does not contain a time signature", () => {
    it("should throw an error", () => {
      const input = {
        SceneId: "0e30ef4e-77bf-11eb-9439-0242ac130002",
        TrackId: "d5656678-77c2-11eb-9439-0242ac130002",
        name: "MyClip",
        tempo: 120,
      };
      assert.throws(() => {
        const output = Clip.validatePost(input);
      });
    });
  });

  describe("when id is not a valid uuid", () => {
    it("should throw an error", () => {
      const input = {
        id: "1234567890abcdef",
        name: "MyClip",
        tempo: 120,
        time_signature: "4/4",
      };

      assert.throws(() => {
        const output = Clip.validatePost(input);
      });
    });
  });

  describe("when name is not a valid name", () => {
    it("should throw an error", () => {
      const input = {
        SceneId: "0e30ef4e-77bf-11eb-9439-0242ac130002",
        TrackId: "d5656678-77c2-11eb-9439-0242ac130002",
        name: "hi",
        tempo: 120,
        time_signature: "4/4",
      };

      assert.throws(() => {
        const output = Clip.validatePost(input);
      });
    });
  });

  describe("when tempo is not a valid tempo", () => {
    it("should throw an error", () => {
      const input = {
        SceneId: "0e30ef4e-77bf-11eb-9439-0242ac130002",
        TrackId: "d5656678-77c2-11eb-9439-0242ac130002",
        name: "MyClip",
        tempo: 20,
        time_signature: "4/4",
      };

      assert.throws(() => {
        const output = Clip.validatePost(input);
      });
    });
  });

  describe("when time signature is not a valid time signature", () => {
    it("should throw an error", () => {
      const input = {
        SceneId: "0e30ef4e-77bf-11eb-9439-0242ac130002",
        TrackId: "d5656678-77c2-11eb-9439-0242ac130002",
        name: "MyClip",
        tempo: 120,
        time_signature: "44",
      };

      assert.throws(() => {
        const output = Clip.validatePost(input);
      });
    });
  });
});
