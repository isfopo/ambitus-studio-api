const assert = require("assert");
const User = require("../../handlers/user");

let token = "";

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

describe("hashValidPassword", () => {
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

describe("authorize", () => {
  describe("when the request contains a valid token in header", () => {
    it("should assign user object to req.user", () => {
      const req = { headers: { Authorization: `Bearer ${token}` } };
      User.authorize(req);
      assert.deepStrictEqual(req.user, {});
    });
  });

  describe("when the request contains an invalid token", () => {
    it("should throw an error", () => {});
  });

  describe("when the request does not contain a token", () => {
    it("should throw an error", () => {});
  });

  describe("when the request contains an expired token", () => {
    it("should throw an error", () => {});
  });
});

describe("isInDatabase", () => {
  describe("when is given valid user id", () => {
    it("should return user object", () => {});
  });

  describe("when is given user id that is in database", () => {
    it("should return user object", () => {});
  });

  describe("when is given invalid user id", () => {
    it("should throw an error", () => {});
  });

  describe("when is given user id that is  not in database", () => {
    it("should throw an error", () => {});
  });
});

describe("post", () => {
  describe("when a valid username and password are given", () => {
    it("should return a 200 status", () => {});
    it("should return id and username in response", () => {});
  });

  describe("when a valid username and password are given", () => {
    it("should return a 400 status", () => {});
    it("should throw an error", () => {});
  });

  describe("when given username is taken", () => {
    it("should return a 400 status", () => {});
    it("should throw an error", () => {});
  });
});

describe("get", () => {});

describe("getLogin", () => {});

describe("getProjects", () => {});

describe("getAvatar", () => {});

describe("putUsername", () => {});

describe("putPassword", () => {});

describe("putAvatar", () => {});

describe("remove", () => {});
