const assert = require("assert");
const {
  getFilteredContent,
  makeHeader,
  getFileData,
  isFileExists,
  format
} = require("../src/lib.js");

const { extractCharacters, extractLines } = require("../src/util.js");

describe("getFilteredContent", () => {
  let files = {
    file1: "A\nB\nC\nD\nE\nF\nG\nH\nI\nJ\nK\nL\nM\nN\nO\nP",
    file2: "a\nb\nc\nd\ne\nf\ng\nh\ni\nj\nk\nl\nm\nn\no\np"
  };

  it("should return file content with header if more than one are given", () => {
    let fs = {
      readFileSync: function(file) {
        return files[file];
      },
      existsSync: function() {
        return true;
      }
    };

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
    let fs = {
      readFileSync: function(file) {
        return files[file];
      },
      existsSync: function() {
        return true;
      }
    };

    let actual = getFilteredContent(fs, 1, extractLines, 3, "tail", "file2");
    let expected = "n\no\np";
    assert.deepEqual(actual, expected);
  });

  it("should return error when file doesn't exist", () => {
    let fs = {
      readFileSync: function(file) {
        return files[file];
      },
      existsSync: function() {
        return false;
      }
    };

    let actual = getFilteredContent(fs, 1, extractLines, 1, "tail", "file1");
    let expected = "tail: file1: No such file or directory";
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

describe("getFileData for head", () => {
  let files = {
    file1: "A\nB\nC\nD\nE\nF\nG\nH\nI\nJ\nK\nL\nM\nN\nO\nP",
    file2: "a\nb\nc\nd\ne\nf\ng\nh\ni\nj\nk\nl\nm\nn\no\np",
    file3: "first line\nsecond line"
  };

  it("should return the file data if -c input is given with length and file", () => {
    let fs = {
      readFileSync: function(file) {
        return files[file];
      },
      existsSync: function() {
        return true;
      }
    };

    let actual = getFileData(["-c3", "file3"], fs, "head");
    let expected = ["fir"];
    assert.deepEqual(actual, expected);
  });

  it("should return the file data if -n input is given with length and file", () => {
    let fs = {
      readFileSync: function(file) {
        return files[file];
      },
      existsSync: function() {
        return true;
      }
    };

    let actual = getFileData(["-n2", "file1"], fs, "head");
    let expected = ["A\nB"];
    assert.deepEqual(actual, expected);
  });

  it("should return the file content in default case of length 10", () => {
    let fs = {
      readFileSync: function(file) {
        return files[file];
      },
      existsSync: function() {
        return true;
      }
    };

    let actual = getFileData(["file1"], fs, "head");
    let expected = ["A\nB\nC\nD\nE\nF\nG\nH\nI\nJ"];
    assert.deepEqual(actual, expected);
  });

  it("should return error message if type is -n and length is not provided", () => {
    let fs = {
      readFileSync: function(file) {
        return files[file];
      },
      existsSync: function() {
        return true;
      }
    };

    let actual = getFileData(["-n", "file2"], fs, "head");
    let expected = ["head: illegal line count -- file2"];
    assert.deepEqual(actual, expected);
  });

  it("should return file content with header if more than two files are provided", () => {
    let fs = {
      readFileSync: function(file) {
        return files[file];
      },
      existsSync: function() {
        return true;
      }
    };

    let actual = getFileData(["-c3", "file1", "file2"], fs, "head");
    let expected = ["==> file1 <==\nA\nB", "==> file2 <==\na\nb"];
    assert.deepEqual(actual, expected);

    actual = getFileData(["-n3", "file1", "file2"], fs, "head");
    expected = ["==> file1 <==\nA\nB\nC", "==> file2 <==\na\nb\nc"];
    assert.deepEqual(actual, expected);
  });

  it("should return file contents when only range is provided and no option is given", () => {
    let fs = {
      readFileSync: function(file) {
        return files[file];
      },
      existsSync: function() {
        return true;
      }
    };

    let actual = getFileData(["-3", "file1"], fs, "head");
    let expected = ["A\nB\nC"];
    assert.deepEqual(actual, expected);
  });

  it("should return error message if file doesn't exist for single file", () => {
    let fs = {
      existsSync: function() {
        return false;
      }
    };

    let actual = getFileData(["-c3", "file1"], fs, "head");
    let expected = ["head: file1: No such file or directory"];
    assert.deepEqual(actual, expected);
  });

  it("should return error message if file doesn't exist if more than one file provided", () => {
    let fs = {
      existsSync: function() {
        return false;
      }
    };

    let actual = getFileData(["-c3", "file1", "file2"], fs, "head");
    let expected = [
      "head: file1: No such file or directory",
      "head: file2: No such file or directory"
    ];
    assert.deepEqual(actual, expected);
  });
});

describe("getFileData for tail", () => {
  let files = {
    file1: "A\nB\nC\nD\nE\nF\nG\nH\nI\nJ\nK\nL\nM\nN\nO\nP",
    file2: "a\nb\nc\nd\ne\nf\ng\nh\ni\nj\nk\nl\nm\nn\no\np",
    file3: "first line\nsecond line"
  };

  it("should return empty array if 0 as a count is provided with option -c", () => {
    let fs = {
      readFileSync: function(file) {
        return files[file];
      },
      existsSync: function() {
        return true;
      }
    };

    let actual = getFileData(["-c0", "file1"], fs, "tail");
    let expected = [];
    assert.deepEqual(actual, expected);
  });

  it("should return empty array if 0 as a count is provided with option -n", () => {
    let fs = {
      readFileSync: function(file) {
        return files[file];
      },
      existsSync: function() {
        return true;
      }
    };

    let actual = getFileData(["-n0", "file1"], fs, "tail");
    let expected = [];
    assert.deepEqual(actual, expected);
  });

  it("should return the file data if -c input is given with length and files", () => {
    let fs = {
      readFileSync: function(file) {
        return files[file];
      },
      existsSync: function() {
        return true;
      }
    };

    let actual = getFileData(["-c3", "file3"], fs, "tail");
    let expected = ["ine"];
    assert.deepEqual(actual, expected);
  });

  it("should return the file data if -n input is given with length and files", () => {
    let fs = {
      readFileSync: function(file) {
        return files[file];
      },
      existsSync: function() {
        return true;
      }
    };

    let actual = getFileData(["-n2", "file1"], fs, "tail");
    let expected = ["O\nP"];
    assert.deepEqual(actual, expected);
  });

  it("should return the file content in default case of length 10", () => {
    let fs = {
      readFileSync: function(file) {
        return files[file];
      },
      existsSync: function() {
        return true;
      }
    };

    let actual = getFileData(["file1"], fs, "tail");
    let expected = ["G\nH\nI\nJ\nK\nL\nM\nN\nO\nP"];
    assert.deepEqual(actual, expected);
  });

  it("should return error message if type is -n and length is not provided", () => {
    let fs = {
      readFileSync: function(file) {
        return files[file];
      },
      existsSync: function() {
        return true;
      }
    };

    let actual = getFileData(["-n", "file1"], fs, "tail");
    let expected = ["tail: illegal offset -- file1"];
    assert.deepEqual(actual, expected);
  });

  it("should return file content with header if more than two files are provided", () => {
    let fs = {
      readFileSync: function(file) {
        return files[file];
      },
      existsSync: function() {
        return true;
      }
    };

    let actual = getFileData(["-c3", "file2", "file3"], fs, "tail");
    let expected = ["==> file2 <==\no\np", "==> file3 <==\nine"];
    assert.deepEqual(actual, expected);

    actual = getFileData(["-n3", "file1", "file2"], fs, "tail");
    expected = ["==> file1 <==\nN\nO\nP", "==> file2 <==\nn\no\np"];
    assert.deepEqual(actual, expected);
  });

  it("should return file contents when only range is provided and no option is given", () => {
    let fs = {
      readFileSync: function(file) {
        return files[file];
      },
      existsSync: function() {
        return true;
      }
    };

    let actual = getFileData(["-3", "file1"], fs, "tail");
    let expected = ["N\nO\nP"];
    assert.deepEqual(actual, expected);
  });

  it("should return error message if file doesn't exist for single file", () => {
    let fs = {
      existsSync: function() {
        return false;
      }
    };

    let actual = getFileData(["-c3", "file1"], fs, "tail");
    let expected = ["tail: file1: No such file or directory"];
    assert.deepEqual(actual, expected);
  });

  it("should return error message if file doesn't exist if more than one file provided", () => {
    let fs = {
      existsSync: function() {
        return false;
      }
    };

    let actual = getFileData(["-c3", "file1", "file2"], fs, "tail");
    let expected = [
      "tail: file1: No such file or directory",
      "tail: file2: No such file or directory"
    ];
    assert.deepEqual(actual, expected);
  });
});

describe("isFileExists", () => {
  it("should return true if it finds the file", () => {
    let fs = {
      existsSync: function() {
        return true;
      }
    };

    let actual = isFileExists(fs.existsSync, "file");
    let expected = true;
    assert.equal(actual, expected);
  });

  it("should return false if it can't find the file", () => {
    let fs = {
      existsSync: function() {
        return false;
      }
    };

    let actual = isFileExists(fs.existsSync, "file");
    let expected = false;
    assert.equal(actual, expected);
  });
});

describe("format", function() {

  let files = {
    words: "one\ntwo\nthree",
    numbers: "1\n2\n3\n4\n5"
  };
 
  let fs = {
    readFileSync: function(file) {
      return files[file];
    },
  };

  it("should add header and return content of given file", function() {
    let fileName = "words";
    let actual = format(fs.readFileSync, extractCharacters, "head", fileName, 3);
    let expected = "==> words <==\none";
    assert.deepEqual(actual, expected);

    fileName = "numbers";
    expected = "==> numbers <==\n4\n5";
    actual = format(fs.readFileSync, extractLines, "tail", fileName, 2);
    assert.deepEqual(actual, expected);
  });
});
