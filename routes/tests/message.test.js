const assert = require("assert");
const Message = require("../handlers/message");

describe("Message.validatePost", () => {
  describe("when body contains content", () => {
    it("should return body", () => {
      const input = {
        content: "This sounds great!!!",
      };
      const output = Message.validatePost(input);
      assert.deepStrictEqual(output, input);
    });
  });

  describe("when body does not contain content", () => {
    it("should throw an error", () => {
      const input = {
        ProjectId: "709ae450-7017-11eb-beda-e76c7ddac317",
      };
      assert.throws(() => {
        const output = Message.validatePost(input);
      });
    });
  });

  describe("when content is not a valid message", () => {
    it("should throw an error", () => {
      const input = {
        ProjectId: "709ae450-7017-11eb-beda-e76c7ddac317",
        content: 12345,
      };
      assert.throws(() => {
        const output = Message.validatePost(input);
      });
    });
  });
});
