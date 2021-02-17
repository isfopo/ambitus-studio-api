const assert = require("assert");
const User = require("../handlers/user");

describe("validatePost", () => {
  describe("when body contains a valid username and password", () => {
    it("should return body", () => {
      const input = { username: "test", password: "pass1234" };
      const output = User.validatePost(input);
      assert.deepStrictEqual(output, input);
    });
  });

  describe("when body does not contain a username", () => {
    it("should throw an error", () => {
      const input = { password: "pass1234" };
      assert.throws(() => {
        const output = User.validatePost(input);
      });
    });
  });

  describe("when body does not contain a valid username", () => {
    it("should throw an error", () => {
      const input = { username: "hi" };
      assert.throws(() => {
        const output = User.validatePost(input);
      });
    });

    it("should throw an error", () => {
      const input = { username: "whyHelloThereGoodSir" };
      assert.throws(() => {
        const output = User.validatePost(input);
      });
    });
  });

  describe("when body does not contain a password", () => {
    it("should throw an error", () => {
      const input = { username: "test" };
      assert.throws(() => {
        const output = User.validatePost(input);
      });
    });
  });

  describe("when body does not contain a valid password", () => {
    it("should throw an error", () => {
      const input = { password: "1234" };
      assert.throws(() => {
        const output = User.validatePost(input);
      });
    });
  });
});
