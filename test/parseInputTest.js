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
    let actual = isDetailsStartsWithHyphen("-abc");
    let expected = true;
    deepEqual(actual, expected);

    actual = isDetailsStartsWithHyphen("-a-b-c");
    expected = true;
    deepEqual(actual, expected);
  });

  it("should returns false if given input not starts with hyphen", () => {
    let actual = isDetailsStartsWithHyphen("abc-");
    let expected = false;
    deepEqual(actual, expected);

    actual = isDetailsStartsWithHyphen("a-b-c");
    expected = false;
    deepEqual(actual, expected);
  });
});

describe("isNumberOption", function() {
  it("should return true if given argument has number after hyphen", function() {
    let actual = isNumberOption("-5");
    let expected = true;
    deepEqual(actual, expected);
  });

  it("should return false if given argument has not a number after hyphen", function() {
    let actual = isNumberOption("-a");
    let expected = false;
    deepEqual(actual, expected);
  });
});

describe("isOptionWithCount", function() {
  it("should return true if given argument has number after hyphen with option", function() {
    let actual = isOptionWithCount("-n5");
    let expected = true;
    deepEqual(actual, expected);
  });

  it("should return false if given argument has not a number after hyphen with option", function() {
    let actual = isOptionWithCount("-n")
    let expected = false;
    deepEqual(actual, expected);
  });
});

describe("isOptionWithoutCount", function() {
  it("should return true if given argument has only valid option without count", function() {
    let actual = isOptionWithoutCount("-n");
    let expected = true;
    deepEqual(actual, expected);
  });

  it("should return false if given argument has not a valid option", function() {
    let actual = isOptionWithoutCount("-n5");
    let expected = false;
    deepEqual(actual, expected);
  });
});

describe("parseInputs", function() {
  it("should classify params when number option is given", function() {
    let actual = parseInputs(["-3", "words"]);
    let expected = {
      option: "-n",
      count: 3,
      fileNames: ["words"]
    };
    deepEqual(actual, expected);
  });

  it("should classify params when space is given between option and count", function() {
    let actual = parseInputs(["-n", "10", "words"]);
    let expected = {
      option: "-n",
      count: 10,
      fileNames: ["words"]
    };
    deepEqual(actual, expected);
  });

  it("should classify params when option is given with count", function() {
    let actual = parseInputs(["-n5", "words"]);
    let expected = {
      option: "-n",
      count: 5,
      fileNames: ["words"]
    };
    deepEqual(actual, expected);
  });

  it("should return default classification no option is provided", function() {
    let actual = parseInputs(["words"]);
    let expected = {
      option: "-n",
      count: 10,
      fileNames: ["words"]
    };
    deepEqual(actual, expected);
  });
});
