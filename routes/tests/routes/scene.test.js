const assert = require("assert");
const Scene = require("../../handlers/scene");

describe("Scene.validatePost", () => {
  describe("when body contains valid id, name, tempo and time signature", () => {
    it("returns body", () => {
      const input = {
        id: "709ae450-7017-11eb-beda-e76c7ddac317",
        name: "MyScene",
        tempo: 120,
        time_signature: "4/4",
      };
      const output = Scene.validatePost(input);
      assert.deepStrictEqual(output, input);
    });
  });

  describe("when body contains valid id", () => {
    it("returns body", () => {
      const input = {
        id: "709ae450-7017-11eb-beda-e76c7ddac317",
      };
      const output = Scene.validatePost(input);
      assert.deepStrictEqual(output, input);
    });
  });

  describe("when body contains valid id and name", () => {
    it("returns body", () => {
      const input = {
        id: "709ae450-7017-11eb-beda-e76c7ddac317",
        name: "MyScene",
      };
      const output = Scene.validatePost(input);
      assert.deepStrictEqual(output, input);
    });
  });

  describe("when body contains valid id and tempo", () => {
    it("returns body", () => {
      const input = {
        id: "709ae450-7017-11eb-beda-e76c7ddac317",
        tempo: 120,
      };
      const output = Scene.validatePost(input);
      assert.deepStrictEqual(output, input);
    });
  });

  describe("when body contains valid id and time signature", () => {
    it("returns body", () => {
      const input = {
        id: "709ae450-7017-11eb-beda-e76c7ddac317",
        time_signature: "4/4",
      };
      const output = Scene.validatePost(input);
      assert.deepStrictEqual(output, input);
    });
  });

  describe("when body contains valid id, tempo and time signature", () => {
    it("returns body", () => {
      const input = {
        id: "709ae450-7017-11eb-beda-e76c7ddac317",
        tempo: 120,
        time_signature: "4/4",
      };
      const output = Scene.validatePost(input);
      assert.deepStrictEqual(output, input);
    });
  });

  describe("when body contains valid id, name and time signature", () => {
    it("returns body", () => {
      const input = {
        id: "709ae450-7017-11eb-beda-e76c7ddac317",
        name: "MyScene",
        time_signature: "4/4",
      };
      const output = Scene.validatePost(input);
      assert.deepStrictEqual(output, input);
    });
  });

  describe("when body contains valid id, name and tempo", () => {
    it("returns body", () => {
      const input = {
        id: "709ae450-7017-11eb-beda-e76c7ddac317",
        name: "MyScene",
        tempo: 120,
      };
      const output = Scene.validatePost(input);
      assert.deepStrictEqual(output, input);
    });
  });

  describe("when body does not contain an id", () => {
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

  describe("when id is not a valid uuid", () => {
    it("should throw an error", () => {
      const input = {
        id: "1234567890abcdef",
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
        id: "709ae450-7017-11eb-beda-e76c7ddac317",
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
        id: "709ae450-7017-11eb-beda-e76c7ddac317",
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
        id: "709ae450-7017-11eb-beda-e76c7ddac317",
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
