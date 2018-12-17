const {extractContents } = require('../src/util.js');
const assert = require('assert');

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
  