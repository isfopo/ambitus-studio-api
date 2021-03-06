"use strict";

const assert = require("assert");
const order = require("../../handlers/helpers/order");

describe("getNextIndex", () => {
  describe("when given an object and property containing integer", () => {
    it("should return an integer one greater than greatest integer in property", () => {
      const input = [{ index: 1 }, { index: 2 }, { index: 3 }];
      const output = order.getNextIndex(input, "index");
      assert.deepStrictEqual(output, 4);
    });
  });

  describe("when object does not contain the given property", () => {
    it("should throw an error", () => {
      const input = [{ index: 1 }, { index: 2 }, { index: 3 }];
      assert.throws(() => {
        const output = order.getNextIndex(input, "id");
      }, ["object does not contain key"]);
    });
  });

  describe("when property does not contain integers", () => {
    it("should throw an error", () => {
      const input = [{ index: "a" }, { index: "b" }, { index: "c" }];
      assert.throws(() => {
        const output = order.getNextIndex(input, "index");
      }, ["key is not an integer"]);
    });
  });
});
