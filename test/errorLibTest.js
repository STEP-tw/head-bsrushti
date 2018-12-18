const assert = require("assert");
const {
  getInvalidCountError,
  fileNotFoundError,
} = require("../src/errorLib.js");

describe("getInvalidCountError", () => {
  it("should return error message if invalid length provided with option -c and command head", () => {
    let actual = getInvalidCountError("-c", "1q", "head");
    let expected = "head: illegal byte count -- 1q";
    assert.equal(actual, expected);

    actual = getInvalidCountError("-c", "aaa", "head");
    expected = "head: illegal byte count -- aaa";
    assert.equal(actual, expected);
  });

  it("should return error message if invalid length provided with option -n and command head", () => {
    let actual = getInvalidCountError("-n", "1q", "head");
    let expected = "head: illegal line count -- 1q";
    assert.equal(actual, expected);

    actual = getInvalidCountError("-n", "aaa", "head");
    expected = "head: illegal line count -- aaa";
    assert.equal(actual, expected);
  });

  it("should return error message if invalid length provided with option -c and command tail", () => {
    let actual = getInvalidCountError("-c", "1q", "tail");
    let expected = "tail: illegal offset -- 1q";
    assert.equal(actual, expected);

    actual = getInvalidCountError("-c", "aaa", "tail");
    expected = "tail: illegal offset -- aaa";
    assert.equal(actual, expected);
  });

  it("should return error message if invalid length provided with option -n and command tail", () => {
    let actual = getInvalidCountError("-n", "1q", "tail");
    let expected = "tail: illegal offset -- 1q";
    assert.equal(actual, expected);

    actual = getInvalidCountError("-n", "aaa", "tail");
    expected = "tail: illegal offset -- aaa";
    assert.equal(actual, expected);
  });
});

describe("fileNotFoundError", () => {
  it("should return error message if it not finds the file", () => {
    let actual = fileNotFoundError("file", "head");
    let expected = "head: file: No such file or directory";
    assert.equal(actual, expected);
  });
});
