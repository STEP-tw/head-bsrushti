const assert = require("assert");
const { makeHeader, addHeading } = require("../src/format.js");

describe("addHeading", function() {
  let files = {
    words: "one\ntwo\nthree",
    numbers: "1\n2\n3\n4\n5"
  };

  it("should add header and return content of given file", function() {
    let fileName = "words";
    let actual = addHeading(fileName, files[fileName]);
    let expected = "==> words <==\none\ntwo\nthree";
    assert.deepEqual(actual, expected);

    fileName = "numbers";
    expected = "==> numbers <==\n1\n2\n3\n4\n5";
    actual = addHeading(fileName, files[fileName]);
    assert.deepEqual(actual, expected);
  });
});

describe("makeHeading", () => {
  it("should return heading with two spaces if empty title(empty string) is given", () => {
    let actual = makeHeader("");
    let expected = "==>  <==";
    assert.equal(actual, expected);
  });

  it("should return heading to given title", () => {
    let actual = makeHeader("abc");
    let expected = "==> abc <==";
    assert.equal(actual, expected);

    actual = makeHeader("file1");
    expected = "==> file1 <==";
    assert.equal(actual, expected);
  });

  it("should return heading when input is not a string", () => {
    let actual = makeHeader(123);
    let expected = "==> 123 <==";
    assert.equal(actual, expected);
  });
});
