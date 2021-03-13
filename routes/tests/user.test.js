const assert = require("assert");
const sinon = require("sinon");
const jwt = require("jsonwebtoken");
const User = require("../handlers/user");
const models = require("../../db/models");

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

describe("User.parseHeadersForToken", () => {
  describe("when headers contain authorization header", () => {
    it("should return headers", () => {
      const headers = { authorization: "Bearer someToken" };
      const output = User.parseHeadersForToken(headers);
      assert.deepStrictEqual(output, "someToken");
    });
  });

  describe("when headers do not contain an authorization header", () => {
    it("should throw an error", () => {
      const headers = {};
      assert.throws(() => {
        const output = User.parseHeadersForToken(headers);
      });
    });
  });
});

describe("User.verifyToken", () => {
  beforeEach(() => {
    sinon.spy(jwt, "verify");
  });

  afterEach(() => {
    jwt.verify.restore();
  });
  describe("when given a token", () => {
    const token = "12345";
    it("should call jwt.verify with token", () => {
      User.verifyToken(token);
      assert.deepStrictEqual(jwt.verify.firstCall.args[0], token);
    });
    it("should call jwt.verify with secret", () => {
      User.verifyToken(token);
      assert.deepStrictEqual(
        jwt.verify.firstCall.args[1],
        process.env.JWT_SECRET
      );
    });
  });
});

describe("User.authorize", () => {
  beforeEach(() => {
    sinon.spy(User, "findInDatabase");
  });

  afterEach(() => {
    User.findInDatabase.restore();
  });
  // describe("when given a req object with authorization headers", () => {
  //   it("should call findInDatabase() with user id in token", async () => {
  //     const UserId = "12345";
  //     const token = await User.signToken(UserId);
  //     await User.authorize({ authorization: `Bearer ${token}` });
  //     assert.deepStrictEqual(User.findInDatabase.firstCall.args[0], UserId);
  //   });
  // });
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

describe("User.verifyPassword", () => {
  beforeEach(() => {
    models.User = {
      findOne: (username) =>
        Promise.resolve({
          UserId: "57fc1120-74d7-11eb-8c62-fdd5c8e05336",
          username: username.where.username,
          password:
            "$2b$13$iBtJNpYYAkiAQF5Nb/zILO4Sh77Nm8HtWddffsJat42WpVNKamGuG",
        }),
    };
  });
  describe("when matching username and password are given", () => {
    it("should return a user object", async () => {
      const username = "isfopo";
      const password = "te$tPa55word";
      const user = await User.verifyPassword(username, password);
      assert.deepStrictEqual(user, {
        UserId: "57fc1120-74d7-11eb-8c62-fdd5c8e05336",
        username,
        password:
          "$2b$13$iBtJNpYYAkiAQF5Nb/zILO4Sh77Nm8HtWddffsJat42WpVNKamGuG",
      });
    });
  });
});

describe("User.signToken", () => {
  beforeEach(() => {
    sinon.spy(jwt, "sign");
  });

  afterEach(() => {
    jwt.sign.restore();
  });
  describe("when given a UserId", () => {
    const UserId = "123345";
    it("should call jwt.sign with UserId", () => {
      User.signToken(UserId);
      assert.deepStrictEqual(jwt.sign.firstCall.args[0], { UserId });
    });
    it("should call jwt.sign with secret", () => {
      User.signToken(UserId);
      assert.deepStrictEqual(
        jwt.sign.firstCall.args[1],
        process.env.JWT_SECRET
      );
    });
  });
});

describe("User.saveAvatar", () => {
  const user = { save: () => {} };
  const avatar = { path: "/path/to/avatar", type: "image/jpeg" };
  beforeEach(() => {
    sinon.spy(user, "save");
  });
  afterEach(() => {
    user.save.restore();
  });
  describe("when given user and an avatar", () => {
    it("assigns avatar.path to user.avatar", () => {
      User.saveAvatar(user, avatar);
      assert.deepStrictEqual(user.avatar, avatar.path);
    });
    it("assigns avatar.mimetype to user.avatar_type", () => {
      User.saveAvatar(user, avatar);
      assert.deepStrictEqual(user.avatar_type, avatar.mimetype);
    });
    it("calls user.save()", () => {
      User.saveAvatar(user, avatar);
      assert.ok(user.save.firstCall);
    });
  });
});

describe("User.leave", () => {
  describe("when given a user and a project", () => {
    const user = {};
    const project = { removeUser: () => Promise.resolve({}) };
    beforeEach(() => {
      sinon.spy(project, "removeUser");
    });
    afterEach(() => {
      project.removeUser.restore();
    });
    it("calls project.removeUser() with user", () => {
      User.leave(user, project);
      assert.ok(project.removeUser.firstCall);
      assert.deepStrictEqual(project.removeUser.firstCall.args[0], user);
    });
  });
});

describe("User.leaveAllProjects", () => {
  describe("when given a user", () => {
    const user = { getProjects: () => Promise.resolve({}) };
    beforeEach(() => {
      sinon.spy(user, "getProjects");
    });
    afterEach(() => {
      user.getProjects.restore();
    });
    it("calls user.getProjects() with user", () => {
      User.leaveAllProjects(user);
      assert.ok(user.getProjects.firstCall);
    });
  });
});

describe("User.deleteAllMessages", () => {
  describe("when given a user", () => {
    const user = { getMessages: () => Promise.resolve({}) };
    beforeEach(() => {
      sinon.spy(user, "getMessages");
    });
    afterEach(() => {
      user.getMessages.restore();
    });
    it("calls user.getMessages() with user", () => {
      User.deleteAllMessages(user, user);
      assert.ok(user.getMessages.firstCall);
    });
  });
});
