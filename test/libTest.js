const { equal, deepEqual } = require("assert");
const {
  getFilteredContent,
  makeHeader,
  getFileData,
  isCountAboveZero,
  isFileExists,
  format
} = require("../src/lib.js");

const {
  extractCharacters,
  extractLines
} = require('../src/util.js');

describe("getFilteredContent returns the result as per the mapper function", () => {

  let files = {
    file1 : "A\nB\nC\nD\nE\nF\nG\nH\nI\nJ\nK\nL\nM\nN\nO\nP",
    file2 : "a\nb\nc\nd\ne\nf\ng\nh\ni\nj\nk\nl\nm\nn\no\np"
  };

  it("should return file content with header if more than one are given", () => {
    let fs = {
      readFileSync : function(file) { return files[file]; },
      existsSync : function() { return true;}
    };

    let actual = getFilteredContent(fs, 2, extractCharacters, 3, "head", "file1");
    let expected = "==> file1 <==\nA\nB";
    deepEqual(actual, expected);
  });

  it("should return file content as per the input for tail", () => {
    let fs = {
      readFileSync : function(file) { return files[file]; },
      existsSync : function() { return true;}
    };

    let actual = getFilteredContent(fs, 1, extractLines, 3, "tail", "file2");
    let expected = "n\no\np";
    deepEqual(actual,expected);
  });

  it("should return error when file doesn't exist", () => {
    let fs = {
      readFileSync : function(file) { return files[file]; },
      existsSync : function() { return false;}
    };

    let actual = getFilteredContent(fs, 1, extractLines, 1, "tail", "file1");
    let expected = "tail: file1: No such file or directory";
    deepEqual(actual, expected);
  });
});

describe("makeHeading gives header along with title", () => {
  it("should return heading with two spaces if empty title(empty string) is given", () => {
    let actual = makeHeader("");
    let expected = "==>  <==";
    equal(actual, expected);
  });

  it("should return heading to given title", () => {
    let actual = makeHeader("abc");
    let expected = "==> abc <==";
    equal(actual, expected);

    actual = makeHeader("file1");
    expected = "==> file1 <==";
    equal(actual, expected);
  });
});

describe("getFileData for head", () => {

  let files = {
    file1 : "A\nB\nC\nD\nE\nF\nG\nH\nI\nJ\nK\nL\nM\nN\nO\nP",
    file2 : "a\nb\nc\nd\ne\nf\ng\nh\ni\nj\nk\nl\nm\nn\no\np",
    file3 : "first line\nsecond line"
  };

  it("should return the file data if -n input is given with length and file", () => {
    
    let fs = {
      readFileSync : function(file) { return files[file]; },
      existsSync : function() { return true;}
    };

    let actual = getFileData(["-c3", "file3"], fs, "head");
    let expected = ["fir"];
    deepEqual(actual, expected);
  });

  it("should return the file data if -n input is given with length and file", () => {
    
    let fs = {
      readFileSync : function(file) { return files[file]; },
      existsSync : function() { return true;}
    };

    let actual = getFileData(["-n2", "file1"], fs, "head");
    let expected = ['A\nB'];
    deepEqual(actual, expected);
  });

  it("should return the file content in default case of length 10", () => {
    
    let fs = {
      readFileSync : function(file) { return files[file]; },
      existsSync : function() { return true;}
    };

    let actual = getFileData(["file1"], fs, "head");
    let expected = ['A\nB\nC\nD\nE\nF\nG\nH\nI\nJ'];
    deepEqual(actual, expected);
  });

  it("should return error message if type is -n and length is not provided", () => {
    
    let fs = {
      readFileSync : function(file) { return files[file]; },
      existsSync : function() { return true;}
    };

    let actual = getFileData(["-n", "file2"], fs, "head");
    let expected = ["head: illegal line count -- file2"];
    deepEqual(actual, expected);
  });

  it("should return file content with header if more than two files are provided", () => {
    
    let fs = {
      readFileSync : function(file) { return files[file]; },
      existsSync : function() { return true;}
    };

    let actual = getFileData(["-c3", "file1", "file2"], fs, "head");
    let expected = ["==> file1 <==\nA\nB", "==> file2 <==\na\nb"];
    deepEqual(actual, expected);

    actual = getFileData(["-n3", "file1", "file2"], fs, "head");
    expected = [
      "==> file1 <==\nA\nB\nC",
      "==> file2 <==\na\nb\nc"
    ];
    deepEqual(actual, expected);
  });

  it("should return error message if file doesn't exist for single file", () => {
    
    let fs = {
      existsSync : function() { return false;}
    };

    let actual = getFileData(["-c3", "file1"], fs, "head");
    let expected = ["head: file1: No such file or directory"];
    deepEqual(actual, expected);
  });

  it("should return error message if file doesn't exist if more than one file provided", () => {
    
    let fs = {
      existsSync : function() { return false;}
    };

    let actual = getFileData(["-c3", "file1","file2"], fs, "head");
    let expected = ["head: file1: No such file or directory",
                          "head: file2: No such file or directory"];
    deepEqual(actual, expected);
  });
});

describe("getFileData for tail", () => {
  
  let files = {
    file1 : "A\nB\nC\nD\nE\nF\nG\nH\nI\nJ\nK\nL\nM\nN\nO\nP",
    file2 : "a\nb\nc\nd\ne\nf\ng\nh\ni\nj\nk\nl\nm\nn\no\np",
    file3 : "first line\nsecond line"
  };

  it("should return empty array if 0 as a count is provided with option -c", () => {
    
    let fs = {
      readFileSync : function(file) { return files[file]; },
      existsSync : function() { return true;}
    };
    
    let actual = getFileData(["-c0", "file1"], fs, "tail");
    let expected = [];
    deepEqual(actual, expected);
  });

  it("should return empty array if 0 as a count is provided with option -n", () => {
    
    let fs = {
      readFileSync : function(file) { return files[file]; },
      existsSync : function() { return true;}
    };
    
    let actual = getFileData(["-n0", "file1"], fs, "tail");
    let expected = [];
    deepEqual(actual, expected);
  });

  it("should return the file data if -n input is given with length and files", () => {
    
    let fs = {
      readFileSync : function(file) { return files[file]; },
      existsSync : function() { return true;}
    };

    let actual = getFileData(["-c3", "file3"], fs, "tail");
    let expected = ["ine"];
    deepEqual(actual, expected);
  });

  it("should return the file data if -n input is given with length and files", () => {
    
    let fs = {
      readFileSync : function(file) { return files[file]; },
      existsSync : function() { return true;}
    };

    let actual = getFileData(["-n2", "file1"], fs, "tail");
    let expected = ["O\nP"];
    deepEqual(actual, expected);
  });

  it("should return the file content in default case of length 10", () => {
    
    let fs = {
      readFileSync : function(file) { return files[file]; },
      existsSync : function() { return true;}
    };
    
    let actual = getFileData(["file1"], fs, "tail");
    let expected = ["G\nH\nI\nJ\nK\nL\nM\nN\nO\nP"];
    deepEqual(actual, expected);
  });

  it("should return error message if type is -n and length is not provided", () => {
    
    let fs = {
      readFileSync : function(file) { return files[file]; },
      existsSync : function() { return true;}
    };
    
    let actual = getFileData(["-n", "file1"], fs, "tail");
    let expected = ["tail: illegal offset -- file1"];
    deepEqual(actual, expected);
  });

  it("should return file content with header if more than two files are provided", () => {
    
    let fs = {
      readFileSync : function(file) { return files[file]; },
      existsSync : function() { return true;}
    };

    let actual = getFileData(["-c3", "file2", "file3"], fs, "tail");
    let expected = ["==> file2 <==\no\np", "==> file3 <==\nine"];
    deepEqual(actual, expected);

    actual = getFileData(["-n3", "file1", "file2"], fs, "tail");
    expected = [
      "==> file1 <==\nN\nO\nP",
      "==> file2 <==\nn\no\np"
    ];
    deepEqual(actual, expected);
  });

  it("should return error message if file doesn't exist for single file", () => {
    
    let fs = {
      existsSync : function() { return false;}
    };

    let actual = getFileData(["-c3", "file1"], fs, "tail");
    let expected = ["tail: file1: No such file or directory"];
    deepEqual(actual, expected);
  });

  it("should return error message if file doesn't exist if more than one file provided", () => {
    
    let fs = {
      existsSync : function() { return false;}
    };

    let actual = getFileData(["-c3", "file1","file2"], fs, "tail");
    let expected = ["tail: file1: No such file or directory",
                          "tail: file2: No such file or directory"];
    deepEqual(actual, expected);
  });
});

describe("isCountAboveZero", () => {
  it("should return true if given input is greater than zero", () => {
    let actual = isCountAboveZero(3);
    let expected = true;
    deepEqual(actual, expected);

    actual  = isCountAboveZero(1);
    expected = true;
    deepEqual(actual, expected);
  });

  it("should return false if given input is lesser than zero", () => {
    let actual = isCountAboveZero(-3);
    let expected = false;
    deepEqual(actual, expected);

    actual  = isCountAboveZero(-1);
    expected = false;
    deepEqual(actual, expected);
  });
});

describe("isFileExists", () => {
  it("should return true if it finds the file", () => {
    let fs = {
      existsSync : function() { return true;}
    };
    
    let actual = isFileExists(fs.existsSync, "file");
    let expected = true;
    equal(actual, expected);
  });

  it("should return false if it can't find the file", () => {
    let fs = {
      existsSync : function() { return false;}
    };
    
    let actual = isFileExists(fs.existsSync, "file");
    let expected = false;
    equal(actual, expected);
  });
});

describe("format", function() {
  let fs = {
    readline: function() {
      return "one\ntwo\nthree";
    }
  };

  it("should add header and return content of given file", function() {
    let fileName = "words";
    let actual = format(fs.readline, extractCharacters, 'head', fileName, 3);
    let expected = "==> words <==\none";
    
    deepEqual(actual, expected);

    fileName = "numbers";
    expected = "==> numbers <==\ntwo\nthree";
    actual = format(fs.readline, extractLines, 'tail', fileName, 2);
    deepEqual(actual, expected);
  });
});
