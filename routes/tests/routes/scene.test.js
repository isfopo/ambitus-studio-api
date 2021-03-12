const assert = require("assert");
const Scene = require("../../handlers/scene");

describe("Scene.validatePost", () => {
  describe("when body contains valid ProjectId, name, tempo and time signature", () => {
    it("returns body", () => {
      const input = {
        ProjectId: "709ae450-7017-11eb-beda-e76c7ddac317",
        name: "MyScene",
        tempo: 120,
        time_signature: "4/4",
      };
      const output = Scene.validatePost(input);
      assert.deepStrictEqual(output, input);
    });
  });

  describe("when body contains valid ProjectId", () => {
    it("returns body", () => {
      const input = {
        ProjectId: "709ae450-7017-11eb-beda-e76c7ddac317",
      };
      const output = Scene.validatePost(input);
      assert.deepStrictEqual(output, input);
    });
  });

  describe("when body contains valid ProjectId and name", () => {
    it("returns body", () => {
      const input = {
        ProjectId: "709ae450-7017-11eb-beda-e76c7ddac317",
        name: "MyScene",
      };
      const output = Scene.validatePost(input);
      assert.deepStrictEqual(output, input);
    });
  });

  describe("when body contains valid ProjectId and tempo", () => {
    it("returns body", () => {
      const input = {
        ProjectId: "709ae450-7017-11eb-beda-e76c7ddac317",
        tempo: 120,
      };
      const output = Scene.validatePost(input);
      assert.deepStrictEqual(output, input);
    });
  });

  describe("when body contains valid ProjectId and time signature", () => {
    it("returns body", () => {
      const input = {
        ProjectId: "709ae450-7017-11eb-beda-e76c7ddac317",
        time_signature: "4/4",
      };
      const output = Scene.validatePost(input);
      assert.deepStrictEqual(output, input);
    });
  });

  describe("when body contains valid ProjectId, tempo and time signature", () => {
    it("returns body", () => {
      const input = {
        ProjectId: "709ae450-7017-11eb-beda-e76c7ddac317",
        tempo: 120,
        time_signature: "4/4",
      };
      const output = Scene.validatePost(input);
      assert.deepStrictEqual(output, input);
    });
  });

  describe("when body contains valid ProjectId, name and time signature", () => {
    it("returns body", () => {
      const input = {
        ProjectId: "709ae450-7017-11eb-beda-e76c7ddac317",
        name: "MyScene",
        time_signature: "4/4",
      };
      const output = Scene.validatePost(input);
      assert.deepStrictEqual(output, input);
    });
  });

  describe("when body contains valid ProjectId, name and tempo", () => {
    it("returns body", () => {
      const input = {
        ProjectId: "709ae450-7017-11eb-beda-e76c7ddac317",
        name: "MyScene",
        tempo: 120,
      };
      const output = Scene.validatePost(input);
      assert.deepStrictEqual(output, input);
    });
  });

  describe("when body does not contain an ProjectId", () => {
    it("should throw an error", () => {
      const input = {
        name: "MyScene",
        tempo: 120,
        time_signature: "4/4",
      };
      assert.throws(() => {
        const output = Scene.validatePost(input);
      });
    });
  });

  describe("when ProjectId is not a valid uuid", () => {
    it("should throw an error", () => {
      const input = {
        ProjectId: "1234567890abcdef",
        name: "MyScene",
        tempo: 120,
        time_signature: "4/4",
      };

      assert.throws(() => {
        const output = Scene.validatePost(input);
      });
    });
  });

  describe("when name is not a valid name", () => {
    it("should throw an error", () => {
      const input = {
        ProjectId: "709ae450-7017-11eb-beda-e76c7ddac317",
        name: "hi",
        tempo: 120,
        time_signature: "4/4",
      };

      assert.throws(() => {
        const output = Scene.validatePost(input);
      });
    });
  });

  describe("when tempo is not a valid tempo", () => {
    it("should throw an error", () => {
      const input = {
        ProjectId: "709ae450-7017-11eb-beda-e76c7ddac317",
        name: "MyScene",
        tempo: 20,
        time_signature: "4/4",
      };

      assert.throws(() => {
        const output = Scene.validatePost(input);
      });
    });
  });

  describe("when time signature is not a valid time signature", () => {
    it("should throw an error", () => {
      const input = {
        ProjectId: "709ae450-7017-11eb-beda-e76c7ddac317",
        name: "MyScene",
        tempo: 120,
        time_signature: "44",
      };

      assert.throws(() => {
        const output = Scene.validatePost(input);
      });
    });
  });
});

describe("findInDatabase", () => {}); // TODO: finish test and function
