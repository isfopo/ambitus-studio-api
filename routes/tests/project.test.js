const assert = require("assert");
const Project = require("../handlers/project");

describe("Project.validatePost", () => {
  describe("when body contains a valid name, tempo and time signature", () => {
    it("should return body", () => {
      const input = {
        name: "MyProject",
        tempo: 120,
        time_signature: "4/4",
      };
      const output = Project.validatePost(input);
      assert.deepStrictEqual(output, input);
    });
  });

  describe("when body does not contain a name", () => {
    it("should throw an error", () => {
      const input = {
        id: "5ece01d0-7017-11eb-beda-e76c7ddac317",
        tempo: 120,
        time_signature: "4/4",
      };
      assert.throws(() => {
        const output = Project.validatePost(input);
      });
    });
  });

  describe("when body does not contain a tempo", () => {
    it("should throw an error", () => {
      const input = {
        id: "5ece01d0-7017-11eb-beda-e76c7ddac317",
        name: "MyProject",
        time_signature: "4/4",
      };
      assert.throws(() => {
        const output = Project.validatePost(input);
      });
    });
  });

  describe("when body does not contain a time signature", () => {
    it("should throw an error", () => {
      const input = {
        id: "5ece01d0-7017-11eb-beda-e76c7ddac317",
        name: "MyProject",
        tempo: 120,
      };
      assert.throws(() => {
        const output = Project.validatePost(input);
      });
    });
  });

  describe("when name is not a valid name", () => {
    it("should throw an error", () => {
      const input = {
        id: "5ece01d0-7017-11eb-beda-e76c7ddac317",
        name: "hi",
        tempo: 120,
        time_signature: "4/4",
      };
      assert.throws(() => {
        const output = Project.validatePost(input);
      });
    });
  });

  describe("when tempo is not a valid tempo", () => {
    it("should throw an error", () => {
      const input = {
        id: "5ece01d0-7017-11eb-beda-e76c7ddac317",
        name: "MyProject",
        tempo: 20,
        time_signature: "4/4",
      };
      assert.throws(() => {
        const output = Project.validatePost(input);
      });
    });
  });

  describe("when time signature is not a valid time signature", () => {
    it("should throw an error", () => {
      const input = {
        id: "5ece01d0-7017-11eb-beda-e76c7ddac317",
        name: "MyProject",
        tempo: 120,
        time_signature: "44",
      };
      assert.throws(() => {
        const output = Project.validatePost(input);
      });
    });
  });
});

describe("Project.isInDatabase", () => {
  describe("when project with given id is in database", () => {
    it("should return the project", () => {});
  });

  describe("when project with given id is not in database", () => {
    it("should return an error", () => {
      const projectId = 1234;
      assert.throws(() => {
        const project = new Project.findInDatabase(projectId);
      });
    });
  });
});
