const assert = require("assert");
const sinon = require("sinon");
const User = require("../../handlers/user");
const models = require("../../../db/models");

let token = "";

describe("User.validatePost", () => {
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

describe("User.hashValidPassword", () => {
  describe("when a valid password is given", () => {
    it("should return a hashed password", async () => {
      const input = "te$tPa55word";
      const output = await User.hashValidPassword(input);
      assert.ok(
        output.match(
          /^[$]2[abxy]?[$](?:0[4-9]|[12][0-9]|3[01])[$][./0-9a-zA-Z]{53}$/
        )
      );
    });
  });
});

describe("User.findInDatabase", () => {
  beforeEach(() => {
    models.User = {
      findByPk: (UserId) => Promise.resolve({ UserId, username: "isfopo" }),
    };
    sinon.spy(models.User, "findByPk");
  });

  afterEach(() => {
    models.User.findByPk.restore();
  });

  describe("when is given valid user id that is in database", () => {
    it("should query database for id", () => {
      const userId = "3a4639f8-77b6-11eb-9439-0242ac130002";
      return User.findInDatabase(userId).then(() => {
        assert.deepStrictEqual(models.User.findByPk.firstCall.args, [userId]);
      });
    });

    it("should return a user object", async () => {
      const userId = "3a4639f8-77b6-11eb-9439-0242ac130002";
      const output = await User.findInDatabase(userId);
      assert.deepStrictEqual(output, { UserId: userId, username: "isfopo" });
    });
  });

  describe("when is given invalid user id", () => {
    it("should throw an error", () => {
      const userId = "12345";
      assert.throws(() => {
        const user = new User.findInDatabase(userId);
      });
    });
  });

  describe("when is given user id that is not in database", () => {
    it("should throw an error", () => {
      const userId = "120e31ef4e-77bf-11eb-9439-0242ac130002345";
      assert.throws(() => {
        const user = new User.findInDatabase(userId);
      });
    });
  });
});

describe("User.verifyPassword", () => {});

describe("User.signToken", () => {});
