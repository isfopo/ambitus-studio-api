"use strict";

const assert = require("assert");
const rs = require("randomstring");
const { valuesIn } = require("lodash");
const validate = require("../handlers/helpers/validate");

describe("validate.id", () => {
  describe("when id is a valid uuid", () => {
    it("should return id", () => {
      const input = "5ece01d0-7017-11eb-beda-e76c7ddac317";
      const output = validate.id(input);
      assert.deepStrictEqual(output, input);
    });
  });

  describe("when id is not a valid uuid", () => {
    it("should thrown an error", () => {
      const input = "1234567890abcdef";
      assert.throws(() => {
        const output = validate.id(input);
      });
    });
  });
});

describe("validate.name", () => {
  describe("valid", () => {
    describe("when name is a string", () => {
      it("should return name", () => {
        const input = "isfopo";
        const output = validate.name(input);
        assert.deepStrictEqual(output, "isfopo");
      });
    });

    describe("when name is between 3 and 18 characters", () => {
      it("should return name", () => {
        const input = "isfopo";
        const output = validate.name(input);
        assert.deepStrictEqual(output, "isfopo");
      });
    });
  });

  describe("invalid", () => {
    describe("when name is not a string", () => {
      it("throws error", () => {
        const name = 12345;
        assert.throws(() => {
          const output = validate.name(name);
        });
      });
    });

    describe("when name is less than 3 characters", () => {
      it("throws error", () => {
        const name = "hi";
        assert.throws(() => {
          const output = validate.name(name);
        });
      });
    });

    describe("when name is greater than 18 characters", () => {
      it("throws error", () => {
        const name = "whyHelloThereGoodSir";
        assert.throws(() => {
          const output = validate.name(name);
        });
      });
    });
  });
});

describe("validate.password", () => {
  describe("when password is valid", () => {
    it("should return password", () => {
      const input = "te$tPa55word";
      const output = validate.password(input);
      assert.deepStrictEqual(output, input);
    });
  });

  describe("when password is not a string", () => {
    it("should throw an error", () => {
      const input = 1234;
      assert.throws(() => {
        const output = validate.password(input);
      });
    });
  });

  describe("when password is less than 8 characters", () => {
    it("should throw an error", () => {
      const input = "te$1";
      assert.throws(() => {
        const output = validate.password(input);
      });
    });
  });

  describe("when password does not have two letters", () => {
    it("should throw an error", () => {
      const input = "t12345678$";
      assert.throws(() => {
        const output = validate.password(input);
      });
    });
  });

  describe("when password does not have one capital letters", () => {
    it("should throw an error", () => {
      const input = "te$tpa55word";
      assert.throws(() => {
        const output = validate.password(input);
      });
    });
  });

  describe("when password does not have one special character", () => {
    it("should throw an error", () => {
      const input = "testPa55word";
      assert.throws(() => {
        const output = validate.password(input);
      });
    });
  });

  describe("when password does not have one number", () => {
    it("should throw an error", () => {
      const input = "te$tPassword";
      assert.throws(() => {
        const output = validate.password(input);
      });
    });
  });

  describe("when the password has one or more space", () => {
    it("should throw an error", () => {
      const input = "te$t Pa55word";
      assert.throws(() => {
        const output = validate.password(input);
      });
    });
  });
});

describe("validate.bio", () => {
  describe("when bio is valid", () => {
    it("should return bio", () => {
      const input = "I love tacos";
      const output = validate.bio(input);
      assert.deepStrictEqual(output, input);
    });
  });

  describe("when bio not a string", () => {
    it("should throw an error", () => {
      const input = 1234;
      assert.throws(() => {
        validate.bio(input);
      });
    });
  });

  describe("when bio greater than 160 characters", () => {
    it("should throw an error", () => {
      const input = rs.generate(161);
      assert.throws(() => {
        validate.bio(input);
      });
    });
  });
});

describe("validate.description", () => {
  describe("when description is valid", () => {
    it("should return description", () => {
      const input = "I love tacos";
      const output = validate.description(input);
      assert.deepStrictEqual(output, input);
    });
  });

  describe("when description not a string", () => {
    it("should throw an error", () => {
      const input = 1234;
      assert.throws(() => {
        validate.description(input);
      });
    });
  });

  describe("when description greater than 1200 characters", () => {
    it("should throw an error", () => {
      const input = rs.generate(1201);
      assert.throws(() => {
        validate.description(input);
      });
    });
  });
});

describe("validate.avatar", () => {
  describe("when file type is valid", () => {
    it("should return avatar", () => {
      const input = {
        mimetype: "image/jpeg",
        path:
          "/Users/isaacpoole/Current Projects/ambitus-studio-api/routes/temp/24e961d9968c4e0ff8d017288815edb6",
        size: 804146,
      };
      const output = validate.avatar(input);
      assert.deepStrictEqual(output, input);
    });
  });

  describe("when file size is less than 2GB", () => {
    it("should return avatar", () => {
      const input = {
        mimetype: "image/jpeg",
        path:
          "/Users/isaacpoole/Current Projects/ambitus-studio-api/routes/temp/24e961d9968c4e0ff8d017288815edb6",
        size: 804146,
      };
      const output = validate.avatar(input);
      assert.deepStrictEqual(output, input);
    });
  });

  describe("when file type is not valid", () => {
    it("should throw an error", () => {
      const input = {
        mimetype: "text/html",
        path:
          "/Users/isaacpoole/Current Projects/ambitus-studio-api/routes/temp/24e961d9968c4e0ff8d017288815edb6",
        size: 804146,
      };
      assert.throws(() => {
        const output = validate.avatar(input);
      });
    });
  });

  describe("when file size is greater than 2GB", () => {
    it("should throw an error", () => {
      const input = {
        mimetype: "image/jpeg",
        path:
          "/Users/isaacpoole/Current Projects/ambitus-studio-api/routes/temp/24e961d9968c4e0ff8d017288815edb6",
        size: 2147483649,
      };
      assert.throws(() => {
        const output = validate.avatar(input);
      });
    });
  });
});

describe("validate.tempo", () => {
  describe("valid", () => {
    describe("when tempo is an integer", () => {
      it("should return tempo", () => {
        const tempo = 120;
        const output = validate.tempo(tempo);
        assert.strictEqual(output, 120);
      });
    });

    describe("when tempo is between 40 and 280", () => {
      it("should return tempo", () => {
        const tempo = 120;
        const output = validate.tempo(tempo);
        assert.strictEqual(output, 120);
      });
    });
  });

  describe("invalid", () => {
    describe("when tempo is not an number", () => {
      it("should throw an error", () => {
        const tempo = "IAmNotAnInteger";
        assert.throws(() => {
          const output = validate.tempo(tempo);
        });
      });
    });

    describe("when tempo is not an integer", () => {
      it("should throw an error", () => {
        const tempo = 120.2;
        assert.throws(() => {
          const output = validate.tempo(tempo);
        });
      });
    });

    describe("when tempo less than 40", () => {
      it("should throw an error", () => {
        const tempo = 39;
        assert.throws(() => {
          const output = validate.tempo(tempo);
        });
      });
    });

    describe("when tempo greater than 280", () => {
      it("should throw an error", () => {
        const tempo = 281;
        assert.throws(() => {
          const output = validate.tempo(tempo);
        });
      });
    });
  });
});

describe("validate.time signature", () => {
  describe("valid", () => {
    describe("when time signature is a string", () => {
      it("should return time signature", () => {
        const input = "4/4";
        const output = validate.timeSignature(input);
        assert.deepStrictEqual(output, "4/4");
      });
    });

    describe("when time signature has a '/'", () => {
      it("should return time signature", () => {
        const input = "4/4";
        const output = validate.timeSignature(input);
        assert.deepStrictEqual(output, "4/4");
      });
    });

    describe("when time signature is entirely numbers except for '/'", () => {
      it("should return time signature", () => {
        const input = "4/4";
        const output = validate.timeSignature(input);
        assert.deepStrictEqual(output, "4/4");
      });
    });

    describe("when lower number is a power of 2", () => {
      it("should return time signature", () => {
        const input = "4/8";
        const output = validate.timeSignature(input);
        assert.deepStrictEqual(output, input);
      });
    });

    describe("when lower number is between 1 and 32", () => {
      it("should return time signature", () => {
        const input = "4/4";
        const output = validate.timeSignature(input);
        assert.deepStrictEqual(output, input);
      });
    });

    describe("when upper number between 1 and 32", () => {
      it("should return time signature", () => {
        const input = "4/4";
        const output = validate.timeSignature(input);
        assert.deepStrictEqual(output, input);
      });
    });
  });

  describe("invalid", () => {
    describe("when time signature is not a string", () => {
      it("should throw an error", () => {
        const input = 120;
        assert.throws(() => {
          const output = validate.timeSignature(input);
        });
      });
    });

    describe("when time signature does not have a '/'", () => {
      it("should throw an error", () => {
        const input = "44";
        assert.throws(() => {
          const output = validate.timeSignature(input);
        });
      });
    });

    describe("when time signature has other non-numbers than '/'", () => {
      it("should throw an error", () => {
        const input = "four/four";
        assert.throws(() => {
          const output = validate.timeSignature(input);
        });
      });
    });

    describe("when time signature has other non-numbers than '/'", () => {
      it("should throw an error", () => {
        const input = "four/four";
        assert.throws(() => {
          const output = validate.timeSignature(input);
        });
      });
    });

    describe("when lower number is not a power of 2", () => {
      it("should throw an error", () => {
        const input = "4/3";
        assert.throws(() => {
          const output = validate.timeSignature(input);
        });
      });
    });

    describe("when the lower number is less than 1", () => {
      it("should throw an error", () => {
        const input = "4/0";
        assert.throws(() => {
          const output = validate.timeSignature(input);
        });
      });
    });

    describe("when the lower number is greater than 32", () => {
      it("should throw an error", () => {
        const input = "4/33";
        assert.throws(() => {
          const output = validate.timeSignature(input);
        });
      });
    });

    describe("when the upper number is less than 1", () => {
      it("should throw an error", () => {
        const input = "0/4";
        assert.throws(() => {
          const output = validate.timeSignature(input);
        });
      });
    });

    describe("when the upper number is greater than 32", () => {
      it("should throw an error", () => {
        const input = "33/4";
        assert.throws(() => {
          const output = validate.timeSignature(input);
        });
      });
    });
  });
});

describe("validate.message", () => {
  describe("valid", () => {
    describe("when message is a string", () => {
      it("should return message", () => {
        const input = "Hello!!";
        const output = validate.message(input);
        assert.deepStrictEqual(output, "Hello!!");
      });
    });

    describe("when message is between 1 and 150 characters", () => {
      it("should return message", () => {
        const input = "Hello";
        const output = validate.message(input);
        assert.deepStrictEqual(output, "Hello");
      });
    });
  });

  describe("invalid", () => {
    describe("when message is not a string", () => {
      it("throws error", () => {
        const input = 12345;
        assert.throws(() => {
          const output = validate.message(input);
        });
      });
    });

    describe("when message is less than 0 characters", () => {
      it("throws error", () => {
        const input = "";
        assert.throws(() => {
          const output = validate.message(input);
        });
      });
    });

    describe("when message is greater than 150 characters", () => {
      it("throws error", () => {
        const input =
          "A wonderful serenity has taken possession of my entire soul, like these sweet mornings of spring which I enjoy with my whole heart. I am alone, and fee";
        assert.throws(() => {
          const output = validate.message(input);
        });
      });
    });
  });
});

describe("validate.settings", () => {
  describe("valid", () => {
    describe("when settings are a json object", () => {
      it("should return settings", () => {
        const input = { delay_feedback: 82, gain: 43, synth: "FM" };
        const output = validate.settings(input);
        assert.deepStrictEqual(output, input);
      });
    });
  });

  describe("invalid", () => {
    describe("when settings are not a json object", () => {
      it("should throw and error", () => {
        const input = "notSettings";
        assert.throws(() => {
          const output = validate.settings(input);
        });
      });
    });
  });
});

describe("validate.type", () => {
  describe("valid", () => {
    describe("when type is a string", () => {
      it("should return type", () => {
        const input = "audio/midi";
        const output = validate.type(input);
        assert.deepStrictEqual(output, "audio/midi");
      });
    });

    describe("when type is a a correct mimetype", () => {
      it("should return type", () => {
        const input = "audio/midi";
        const output = validate.type(input);
        assert.deepStrictEqual(output, "audio/midi");
      });
    });
  });

  describe("invalid", () => {
    describe("when type is not a string", () => {
      it("should throw an error", () => {
        const input = { type: "audio / midi" };
        assert.throws(() => {
          const output = validate.type(input);
        });
      });
    });

    describe("when type is an incorrect mimetype", () => {
      it("should throw an error", () => {
        const input = "text/plain";
        assert.throws(() => {
          const output = validate.type(input);
        });
      });
    });
  });
});

describe("validate.integer", () => {
  describe("when input is a valid integer", () => {
    it("should return integer", () => {
      const input = 3;
      const output = validate.integer(input);
      assert.deepStrictEqual(output, input);
    });
  });

  describe("when input is not a valid integer", () => {
    it("should throw an error", () => {
      const input = "abc";
      assert.throws(() => {
        const output = validate.integer(input);
      });
    });
    it("should throw an error", () => {
      const input = 3.3;
      assert.throws(() => {
        const output = validate.integer(input);
      });
    });
  });
});
