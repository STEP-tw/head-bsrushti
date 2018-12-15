const { deepEqual } = require("assert");
const {
  isDetailsStartsWithHyphen,
  isNumberOption,
  isOptionWithCount,
  isOptionWithoutCount,
  parseInputs
} = require("../src/parseInput.js");

describe("isDetailsStartsWithHyphen", () => {
  it("should returns true if given input starts with hyphen", () => {
    deepEqual(isDetailsStartsWithHyphen("-abc"), true);
    deepEqual(isDetailsStartsWithHyphen("-a-b-c"), true);
  });

  it("should returns false if given input not starts with hyphen", () => {
    deepEqual(isDetailsStartsWithHyphen("abc-"), false);
    deepEqual(isDetailsStartsWithHyphen("a-b-c"), false);
  });
});

describe("isNumberOption", function() {
  it("should return true if given argument has number after hyphen", function() {
    deepEqual(isNumberOption("-5"), true);
  });

  it("should return false if given argument has not a number after hyphen", function() {
    deepEqual(isNumberOption("-a"), false);
  });
});

describe("isOptionWithCount", function() {
  it("should return true if given argument has number after hyphen with option", function() {
    deepEqual(isOptionWithCount("-n5"), true);
  });

  it("should return false if given argument has not a number after hyphen with option", function() {
    deepEqual(isOptionWithCount("-n"), false);
  });
});

describe("isOptionWithoutCount", function() {
  it("should return true if given argument has only valid option without count", function() {
    deepEqual(isOptionWithoutCount("-n"), true);
  });

  it("should return false if given argument has not a valid option", function() {
    deepEqual(isOptionWithoutCount("-n5"), false);
  });
});

describe("parseInputs", function() {
  it("should classify params when number option is given", function() {
    let expectedOutput = {
      option: "-n",
      count: 3,
      fileNames: ["words"]
    };
    deepEqual(parseInputs(["-3", "words"]), expectedOutput);
  });

  it("should classify params when option is given without count", function() {
    let expectedOutput = {
      option: "-n",
      count: 10,
      fileNames: ["words"]
    };
    deepEqual(parseInputs(["words"]), expectedOutput);
  });

  it("should classify params when option is given with count", function() {
    let expectedOutput = {
      option: "-n",
      count: 5,
      fileNames: ["words"]
    };
    deepEqual(parseInputs(["-n5", "words"]), expectedOutput);
  });

  it("should return default classification no option is provided", function() {
    let expectedOutput = {
      option: "-n",
      count: 10,
      fileNames: ["words"]
    };
    deepEqual(parseInputs(["words"]), expectedOutput);
  });
});
