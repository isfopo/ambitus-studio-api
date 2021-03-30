const assert = require("assert");
const Scene = require("../handlers/scene");

describe("Scene.validatePost", () => {
  describe("when body contains valid name, tempo and time signature", () => {
    it("returns body", () => {
      const input = {
        name: "MyScene",
        tempo: 120,
        time_signature: "4/4",
      };
      const output = Scene.validatePost(input);
      assert.deepStrictEqual(output, input);
    });
  });

  describe("when body contains valid name", () => {
    it("returns body", () => {
      const input = {
        name: "MyScene",
      };
      const output = Scene.validatePost(input);
      assert.deepStrictEqual(output, input);
    });
  });

  describe("when body contains valid tempo", () => {
    it("returns body", () => {
      const input = {
        tempo: 120,
      };
      const output = Scene.validatePost(input);
      assert.deepStrictEqual(output, input);
    });
  });

  describe("when body contains valid time signature", () => {
    it("returns body", () => {
      const input = {
        time_signature: "4/4",
      };
      const output = Scene.validatePost(input);
      assert.deepStrictEqual(output, input);
    });
  });

  describe("when body contains valid tempo and time signature", () => {
    it("returns body", () => {
      const input = {
        tempo: 120,
        time_signature: "4/4",
      };
      const output = Scene.validatePost(input);
      assert.deepStrictEqual(output, input);
    });
  });

  describe("when body contains valid name and time signature", () => {
    it("returns body", () => {
      const input = {
        name: "MyScene",
        time_signature: "4/4",
      };
      const output = Scene.validatePost(input);
      assert.deepStrictEqual(output, input);
    });
  });

  describe("when body contains valid name and tempo", () => {
    it("returns body", () => {
      const input = {
        name: "MyScene",
        tempo: 120,
      };
      const output = Scene.validatePost(input);
      assert.deepStrictEqual(output, input);
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
