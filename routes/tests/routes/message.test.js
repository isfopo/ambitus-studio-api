const assert = require("assert");
const Message = require("../../handlers/message");

describe("Message.validatePost", () => {
  describe("when body contains ProjectId and content", () => {
    it("should return body", () => {
      const input = {
        ProjectId: "709ae450-7017-11eb-beda-e76c7ddac317",
        content: "This sounds great!!!",
      };
      const output = Message.validatePost(input);
      assert.deepStrictEqual(output, input);
    });
  });

  describe("when body does not contain an ProjectId", () => {
    it("should throw an error", () => {
      const input = {
        content: "This sounds great!!!",
      };
      assert.throws(() => {
        const output = Message.validatePost(input);
      });
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

  describe("when ProjectId is not a valid uuid", () => {
    it("should throw an error", () => {
      const input = {
        ProjectId: "1234567890abcdef",
        content: "This sounds great!!!",
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
