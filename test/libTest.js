const assert = require("assert");
const {
  getFilteredContent,
  head,
  tail,
  getFunctionRef
} = require("../src/lib.js");

const { extractCharacters, extractLines } = require("../src/util.js");

describe("getFilteredContent", () => {
  let files = {
    file1: "A\nB\nC\nD\nE\nF\nG\nH\nI\nJ\nK\nL\nM\nN\nO\nP",
    file2: "a\nb\nc\nd\ne\nf\ng\nh\ni\nj\nk\nl\nm\nn\no\np"
  };

  let fs = {
    readFileSync: function(file) {
      return files[file];
    },

    existsSync: function(file) {
      return Object.keys(files).includes(file);
    }
  };

  it("should return file content with header if more than one are given", () => {
    let actual = getFilteredContent(
      fs,
      2,
      extractCharacters,
      3,
      "head",
      "file1"
    );
    let expected = "==> file1 <==\nA\nB";
    assert.deepEqual(actual, expected);
  });

  it("should return file content as per the input for tail", () => {
    let actual = getFilteredContent(fs, 1, extractLines, 3, "tail", "file2");
    let expected = "n\no\np";
    assert.deepEqual(actual, expected);
  });

  it("should return file content as per the input for head", () => {
    let actual = getFilteredContent(fs, 1, extractLines, 3, "head", "file2");
    let expected = "a\nb\nc";
    assert.deepEqual(actual, expected);
  });

  it("should return error when file doesn't exist", () => {
    let actual = getFilteredContent(fs, 1, extractLines, 1, "tail", "file3");
    let expected = "tail: file3: No such file or directory";
    assert.deepEqual(actual, expected);
  });
});

describe("head", () => {
  let files = {
    file1: "A\nB\nC\nD\nE\nF\nG\nH\nI\nJ\nK\nL\nM\nN\nO\nP",
    file2: "a\nb\nc\nd\ne\nf\ng\nh\ni\nj\nk\nl\nm\nn\no\np",
    file3: "first line\nsecond line"
  };

  let fs = {
    readFileSync: function(file) {
      return files[file];
    },

    existsSync: function(file) {
      return Object.keys(files).includes(file);
    }
  };

  it("should return the file data if -c input is given with length and file", () => {
    let actual = head(["-c3", "file3"], fs);
    let expected = "fir";
    assert.deepEqual(actual, expected);
  });

  it("should return the file data if -n input is given with length and file", () => {
    let actual = head(["-n2", "file1"], fs);
    let expected = "A\nB";
    assert.deepEqual(actual, expected);
  });

  it("should return the file content in default case of length 10", () => {
    let actual = head(["file1"], fs);
    let expected = "A\nB\nC\nD\nE\nF\nG\nH\nI\nJ";
    assert.deepEqual(actual, expected);
  });

  it("should return error message if type is -n and length is not provided", () => {
    let actual = head(["-n", "file2"], fs);
    let expected = "head: illegal line count -- file2";
    assert.deepEqual(actual, expected);
  });

  it("should return file content with header if more than two files are provided", () => {
    let actual = head(["-c3", "file1", "file2"], fs);
    let expected = "==> file1 <==\nA\nB\n==> file2 <==\na\nb";
    assert.deepEqual(actual, expected);

    actual = head(["-n3", "file1", "file2"], fs);
    expected = "==> file1 <==\nA\nB\nC\n==> file2 <==\na\nb\nc";
    assert.deepEqual(actual, expected);
  });

  it("should return file contents when only range is provided and no option is given", () => {
    let actual = head(["-3", "file1"], fs);
    let expected = "A\nB\nC";
    assert.deepEqual(actual, expected);
  });

  it("should return error message if file doesn't exist for single file", () => {
    let actual = head(["-c3", "number"], fs);
    let expected = "head: number: No such file or directory";
    assert.deepEqual(actual, expected);
  });

  it("should return error message if file doesn't exist if more than one file provided", () => {
    let actual = head(["-c3", "file4", "file5"], fs);
    let expected =
      "head: file4: No such file or directory\n" +
      "head: file5: No such file or directory";
    assert.deepEqual(actual, expected);
  });
});

describe("tail", () => {
  let files = {
    file1: "A\nB\nC\nD\nE\nF\nG\nH\nI\nJ\nK\nL\nM\nN\nO\nP",
    file2: "a\nb\nc\nd\ne\nf\ng\nh\ni\nj\nk\nl\nm\nn\no\np",
    file3: "first line\nsecond line"
  };

  let fs = {
    readFileSync: function(file) {
      return files[file];
    },

    existsSync: function(file) {
      return Object.keys(files).includes(file);
    }
  };

  it("should return empty array if 0 as a count is provided with option -c", () => {
    let actual = tail(["-c0", "file1"], fs);
    let expected = "";
    assert.deepEqual(actual, expected);
  });

  it("should return empty array if 0 as a count is provided with option -n", () => {
    let actual = tail(["-n0", "file1"], fs);
    let expected = "";
    assert.deepEqual(actual, expected);
  });

  it("should return the file data if -c input is given with length and files", () => {
    let actual = tail(["-c3", "file3"], fs);
    let expected = "ine";
    assert.deepEqual(actual, expected);
  });

  it("should return the file data if -n input is given with length and files", () => {
    let actual = tail(["-n2", "file1"], fs);
    let expected = "O\nP";
    assert.deepEqual(actual, expected);
  });

  it("should return the file content in default case of length 10", () => {
    let actual = tail(["file1"], fs);
    let expected = "G\nH\nI\nJ\nK\nL\nM\nN\nO\nP";
    assert.deepEqual(actual, expected);
  });

  it("should return error message if type is -n and length is not provided", () => {
    let actual = tail(["-n", "file1"], fs);
    let expected = "tail: illegal offset -- file1";
    assert.deepEqual(actual, expected);
  });

  it("should return file content with header if more than two files are provided", () => {
    let actual = tail(["-c3", "file2", "file3"], fs);
    let expected = "==> file2 <==\no\np\n==> file3 <==\nine";
    assert.deepEqual(actual, expected);

    actual = tail(["-n3", "file1", "file2"], fs, "tail");
    expected = "==> file1 <==\nN\nO\nP\n==> file2 <==\nn\no\np";
    assert.deepEqual(actual, expected);
  });

  it("should return file contents when only range is provided and no option is given", () => {
    let actual = tail(["-3", "file1"], fs);
    let expected = "N\nO\nP";
    assert.deepEqual(actual, expected);
  });

  it("should return error message if file doesn't exist for single file", () => {
    let actual = tail(["-c3", "file4"], fs);
    let expected = "tail: file4: No such file or directory";
    assert.deepEqual(actual, expected);
  });

  it("should return error message if file doesn't exist if more than one file provided", () => {
    let actual = tail(["-c3", "file4", "file5"], fs);
    let expected =
      "tail: file4: No such file or directory\n" +
      "tail: file5: No such file or directory";
    assert.deepEqual(actual, expected);
  });
});

describe("getFunctionRef", function() {
  it("should return function reference for -c ", function() {
    let actual = getFunctionRef("-c");
    let expected = extractCharacters;
    assert.deepEqual(actual, expected);
  });

  it("should return function reference for -n ", function() {
    let actual = getFunctionRef("-n");
    let expected = extractLines;
    assert.deepEqual(actual, expected);
  });
});
