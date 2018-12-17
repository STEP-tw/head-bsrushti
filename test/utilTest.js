const assert = require("assert");
const {
  extractContents,
  extractLines,
  extractCharacters,
  getOptionFuncRef
} = require("../src/util.js");

describe("extractContents returns contents as per the delimiter it has passed", () => {
  it("should return contents separated by \n for head", () => {
    let actual = extractContents("first line\nsecond line", "\n", 0, 2);
    let expected = "first line\nsecond line";
    assert.deepEqual(actual, expected);
  });

  it("should return contents separated by character for head", () => {
    let actual = extractContents("first line\nsecond line", "", 0, 5);
    let expected = "first";
    assert.deepEqual(actual, expected);
  });
});

describe("extractLines", function() {
  describe("For head", () => {
    it("should return lines empty string for 0 length given", function() {
      let actual = extractLines("head", 0, "first\nline\nsecond\nline");
      let expected = "";
      assert.deepEqual(actual, expected);
    });

    it("should return one character for length as input 1", () => {
      let actual = extractLines("head", 1, "first line\nsecond line");
      let expected = "first line";
      assert.deepEqual(actual, expected);
    });

    it("should return number of lines as per the given length", () => {
      let actual = extractLines("head", 2, "first line\nsecond line");
      let expected = "first line\nsecond line";
      assert.deepEqual(actual, expected);

      actual = extractLines("head", 4, "first\nline\nsecond\nline");
      expected = "first\nline\nsecond\nline";
      assert.deepEqual(actual, expected);
    });
  });

  describe("For tail", function() {
    it("should return whole string for 0 length input", () => {
      let actual = extractLines("tail", 0, "first line\nsecond line");
      let expected = "first line\nsecond line";
      assert.deepEqual(actual, expected);
    });

    it("should return one character for length as input 1", () => {
      let actual = extractLines("tail", 1, "first line\nsecond line");
      let expected = "second line";
      assert.deepEqual(actual, expected);
    });

    it("should return number of characters as per the given length", () => {
      let actual = extractLines("tail", 2, "first line\nsecond line");
      let expected = "first line\nsecond line";
      assert.deepEqual(actual, expected);

      actual = extractLines("tail", 5, "first\nline\nsecond\nline");
      expected = "first\nline\nsecond\nline";
      assert.deepEqual(actual, expected);
    });
  });
});

describe("extractCharacters", function() {
  describe("For head", function() {
    it("should return empty string for 0 length input", () => {
      let actual = extractCharacters("head", 0, "first line\nsecond line");
      let expected = "";
      assert.deepEqual(actual, expected);
    });

    it("should return one character for length as input 1", () => {
      let actual = extractCharacters("head", 1, "first line\nsecond line");
      let expected = "f";
      assert.deepEqual(actual, expected);
    });

    it("should return number of characters as per the given length", () => {
      let actual = extractCharacters("head", 2, "first line\nsecond line");
      let expected = "fi";
      assert.deepEqual(actual, expected);

      actual = extractCharacters("head", 5, "first\nline\nsecond\nline");
      expected = "first";
      assert.deepEqual(actual, expected);
    });
  });

  describe("For tail", function() {
    it("should return whole string for 0 length input", () => {
      let actual = extractCharacters("tail", 0, "first line\nsecond line");
      let expected = "first line\nsecond line";
      assert.deepEqual(actual, expected);
    });

    it("should return one character for length as input 1", () => {
      let actual = extractCharacters("tail", 1, "first line\nsecond line");
      let expected = "e";
      assert.deepEqual(actual, expected);
    });

    it("should return number of characters as per the given length", () => {
      let actual = extractCharacters("tail", 2, "first line\nsecond line");
      let expected = "ne";
      assert.deepEqual(actual, expected);

      actual = extractCharacters("tail", 5, "first\nline\nsecond\nline");
      expected = "\nline";
      assert.deepEqual(actual, expected);
    });
  });
});

describe("getOptionFuncRef", function() {
  it("should return function reference for -c ", function() {
    let actual = getOptionFuncRef('-c');
    let expected = extractCharacters;  
    assert.deepEqual(actual,expected)
  });

  it("should return function reference for -n ", function() {
    let actual = getOptionFuncRef('-n');
    let expected = extractLines;  
    assert.deepEqual(actual,expected)
  });
});
