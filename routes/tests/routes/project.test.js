const assert = require("assert");
const Project = require("../../handlers/project");

describe("validatePost", () => {
  describe("when body contains a valid id, tempo and time signature", () => {
    it("should return body", () => {
      const input = {
        id: "5ece01d0-7017-11eb-beda-e76c7ddac317",
        tempo: 120,
        time_signature: "4/4",
      };
      const output = Project.validatePost(input);
      assert.deepStrictEqual(output, input);
    });
  });
});
