const assert = require("assert");
const Clip = require("../../handlers/clip");

describe("Clip.validatePost", () => {
  describe("when body contains valid id, name, type tempo and time signature", () => {
    it("returns body", () => {
      const input = {
        id: "709ae450-7017-11eb-beda-e76c7ddac317",
        type: "audio/midi",
        name: "MyClip",
        tempo: 120,
        time_signature: "4/4",
      };
      const output = Clip.validatePost(input);
      assert.deepStrictEqual(output, input);
    });
  });

  describe("when body contains valid id and type", () => {
    it("returns body", () => {
      const input = {
        id: "709ae450-7017-11eb-beda-e76c7ddac317",
        type: "audio/midi",
      };
      const output = Clip.validatePost(input);
      assert.deepStrictEqual(output, input);
    });
  });

  describe("when body contains valid id, type and name", () => {
    it("returns body", () => {
      const input = {
        id: "709ae450-7017-11eb-beda-e76c7ddac317",
        name: "MyClip",
        type: "audio/midi",
      };
      const output = Clip.validatePost(input);
      assert.deepStrictEqual(output, input);
    });
  });

  describe("when body contains valid id, type and tempo", () => {
    it("returns body", () => {
      const input = {
        id: "709ae450-7017-11eb-beda-e76c7ddac317",
        type: "audio/midi",
        tempo: 120,
      };
      const output = Clip.validatePost(input);
      assert.deepStrictEqual(output, input);
    });
  });

  describe("when body contains valid id, type and time signature", () => {
    it("returns body", () => {
      const input = {
        id: "709ae450-7017-11eb-beda-e76c7ddac317",
        type: "audio/midi",
        time_signature: "4/4",
      };
      const output = Clip.validatePost(input);
      assert.deepStrictEqual(output, input);
    });
  });

  describe("when body contains valid id, type, tempo and time signature", () => {
    it("returns body", () => {
      const input = {
        id: "709ae450-7017-11eb-beda-e76c7ddac317",
        type: "audio/midi",
        tempo: 120,
        time_signature: "4/4",
      };
      const output = Clip.validatePost(input);
      assert.deepStrictEqual(output, input);
    });
  });

  describe("when body contains valid id, type, name and time signature", () => {
    it("returns body", () => {
      const input = {
        id: "709ae450-7017-11eb-beda-e76c7ddac317",
        name: "MyClip",
        type: "audio/midi",
        time_signature: "4/4",
      };
      const output = Clip.validatePost(input);
      assert.deepStrictEqual(output, input);
    });
  });

  describe("when body contains valid id, type, name and tempo", () => {
    it("returns body", () => {
      const input = {
        id: "709ae450-7017-11eb-beda-e76c7ddac317",
        name: "MyClip",
        type: "audio/midi",
        tempo: 120,
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

  describe("when body does not contain a type", () => {
    it("should throw an error", () => {
      const input = {
        id: "709ae450-7017-11eb-beda-e76c7ddac317",
        name: "MyClip",
        tempo: 120,
        time_signature: "4/4",
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
        id: "709ae450-7017-11eb-beda-e76c7ddac317",
        name: "hi",
        tempo: 120,
        time_signature: "4/4",
      };

      assert.throws(() => {
        const output = Clip.validatePost(input);
      });
    });
  });

  describe("when type is not a valid type", () => {
    it("should throw an error", () => {
      const input = {
        id: "709ae450-7017-11eb-beda-e76c7ddac317",
        name: "MyClip",
        type: "text/plain",
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
        id: "709ae450-7017-11eb-beda-e76c7ddac317",
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
        id: "709ae450-7017-11eb-beda-e76c7ddac317",
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
