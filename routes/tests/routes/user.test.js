const assert = require("assert");
const User = require("../../handlers/user");

describe("validatePost", () => {
  describe("when body contains a valid username and password", () => {
    it("should return body", () => {
      const input = { username: "test", password: "te$tPa55word" };
      const output = User.validatePost(input);
      assert.deepStrictEqual(output, input);
    });
  });

  describe("when body does not contain a username", () => {
    it("should throw an error", () => {
      const input = { password: "tPa55word" };
      assert.throws(() => {
        const output = User.validatePost(input);
      }, ["body should contain a username"]);
    });
  });

  describe("when username is not valid", () => {
    it("should throw an error", () => {
      const input = { username: "hi", password: "te$tPa55word" };
      assert.throws(() => {
        const output = User.validatePost(input);
      }, ["name must be at least 3 characters"]);
    });

    it("should throw an error", () => {
      const input = {
        username: "whyHelloThereGoodSir",
        password: "te$tPa55word",
      };
      assert.throws(() => {
        const output = User.validatePost(input);
      }, ["name must be no more than 18 characters"]);
    });
  });

  describe("when body does not contain a password", () => {
    it("should throw an error", () => {
      const input = { username: "test" };
      assert.throws(() => {
        const output = User.validatePost(input);
      }, ["body should contain a password"]);
    });
  });

  describe("when password is not valid", () => {
    it("should throw an error", () => {
      const input = { username: "test", password: "1234" };
      assert.throws(() => {
        const output = User.validatePost(input);
      }, ["password must be at least 8 characters"]);
    });
  });
});
