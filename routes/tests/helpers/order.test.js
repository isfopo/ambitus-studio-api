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

describe("reorderByProperty", () => {
  describe("when given a proper arguments", () => {
    it("should return reordered array", () => {
      const input = [{ id: "1" }, { id: "2" }, { id: "3" }];
      const output = order.reorderByProperty(input, "id", "3", 1);
      assert.deepStrictEqual(output, [{ id: "1" }, { id: "3" }, { id: "2" }]);
    });
    it("should return reordered array", () => {
      const input = [{ id: "1" }, { id: "2" }, { id: "3" }];
      const output = order.reorderByProperty(input, "id", "3", 0);
      assert.deepStrictEqual(output, [{ id: "3" }, { id: "1" }, { id: "2" }]);
    });
    it("should return reordered array", () => {
      const input = [{ id: "1" }, { id: "2" }, { id: "3" }];
      const output = order.reorderByProperty(input, "id", "1", 2);
      assert.deepStrictEqual(output, [{ id: "2" }, { id: "3" }, { id: "1" }]);
    });
  });

  describe("when given an id that is not in array", () => {
    it("should throw an error", () => {
      const input = [{ id: "1" }, { id: "2" }, { id: "3" }];
      assert.throws(() => {
        const output = order.reorderByProperty(input, "id", "4", 1);
      });
    });
  });

  describe("when given a property that is not in array", () => {
    it("should throw an error", () => {
      const input = [{ id: "1" }, { id: "2" }, { id: "3" }];
      assert.throws(() => {
        const output = order.reorderByProperty(input, "name", "3", 1);
      });
    });
  });

  describe("when given an index outside of the array", () => {
    it("should return an array with element at the end", () => {
      const input = [{ id: "1" }, { id: "2" }, { id: "3" }];
      const output = order.reorderByProperty(input, "id", "1", 5);
      assert.deepStrictEqual(output, [{ id: "2" }, { id: "3" }, { id: "1" }]);
    });
  });
});
