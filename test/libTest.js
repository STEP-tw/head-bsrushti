const { equal, deepEqual } = require("assert");
const {
  extractHeadLines,
  extractHeadCharacters,
  getFilteredContent,
  makeHeader,
  getFileData,
  isCountAboveZero,
  isFileExists,
  extractContents,
  extractTailLines,
  extractTailCharacters,
  getOptionFuncRefForTail,
  getOptionFuncRefForHead,
  getFuncRef,
  format
} = require("../src/lib.js");

describe("extractHeadLines returns lines of given text as per the given input", () => {
  it("should return empty string for 0 length input", () => {
    deepEqual(extractHeadLines(0, "first line\nsecond line"), "");
  });

  it("should return one line for length as input 1", () => {
    deepEqual(extractHeadLines(1, "first line\nsecond line"), "first line");
  });

  it("should return empty line for invalid length(negative)", () => {
    deepEqual(extractHeadLines(-1, "first line\nsecond line"), "");
  });

  it("should return number of lines as per the given length", () => {
    deepEqual(
      extractHeadLines(2, "first line\nsecond line"),
      "first line\nsecond line"
    );
    deepEqual(
      extractHeadLines(4, "first\nline\nsecond\nline"),
      "first\nline\nsecond\nline"
    );
  });
});

describe("extractHeadCharacters returns characters of given text as per the given input length", () => {
  it("should return empty string for 0 length input", () => {
    deepEqual(extractHeadCharacters(0, "first line\nsecond line"), "");
  });

  it("should return one character for length as input 1", () => {
    deepEqual(extractHeadCharacters(1, "first line\nsecond line"), "f");
  });

  it("should return empty character for invalid length(negative)", () => {
    deepEqual(extractHeadCharacters(-1, "first line\nsecond line"), "");
  });

  it("should return number of characters as per the given length", () => {
    deepEqual(extractHeadCharacters(2, "first line\nsecond line"), "fi");
    deepEqual(extractHeadCharacters(5, "first\nline\nsecond\nline"), "first");
  });
});

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

    let actual = getFilteredContent(fs, 2, extractHeadCharacters, 3, "head", "file1");
    let expected = "==> file1 <==\nA\nB";
    deepEqual( actual, expected);
  });

  it("should return file content as per the input for tail", () => {
    let fs = {
      readFileSync : function(file) { return files[file]; },
      existsSync : function() { return true;}
    };

    let actual = getFilteredContent(fs, 1, extractTailLines, 3, "tail", "file2");
    let expected = "n\no\np";
    deepEqual(actual,expected);
  });

  it("should return error when file doesn't exist", () => {
    let fs = {
      readFileSync : function(file) { return files[file]; },
      existsSync : function() { return false;}
    };

    let actual = getFilteredContent(fs, 1, extractHeadLines, 1, "tail", "file1");
    let expected = "tail: file1: No such file or directory";
    deepEqual(actual, expected);
  });
});

describe("makeHeading gives header along with title", () => {
  it("should return heading with two spaces if empty title(empty string) is given", () => {
    equal(makeHeader(""), "==>  <==");
  });

  it("should return heading to given title", () => {
    equal(makeHeader("abc"), "==> abc <==");
    equal(makeHeader("file1"), "==> file1 <==");
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
    let expectedOutput = ["fir"];
    deepEqual(actual, expectedOutput);
  });

  it("should return the file data if -n input is given with length and file", () => {
    
    let fs = {
      readFileSync : function(file) { return files[file]; },
      existsSync : function() { return true;}
    };

    let actual = getFileData(["-n2", "file1"], fs, "head");
    let expectedOutput = ['A\nB'];
    deepEqual(actual, expectedOutput);
  });

  it("should return the file content in default case of length 10", () => {
    
    let fs = {
      readFileSync : function(file) { return files[file]; },
      existsSync : function() { return true;}
    };

    let actual = getFileData(["file1"], fs, "head");
    let expectedOutput = ['A\nB\nC\nD\nE\nF\nG\nH\nI\nJ'];
    deepEqual(actual, expectedOutput);
  });

  it("should return error message if type is -n and length is not provided", () => {
    
    let fs = {
      readFileSync : function(file) { return files[file]; },
      existsSync : function() { return true;}
    };

    let actual = getFileData(["-n", "file2"], fs, "head");
    let expectedOutput = ["head: illegal line count -- file2"];
    deepEqual(actual, expectedOutput);
  });

  it("should return file content with header if more than two files are provided", () => {
    
    let fs = {
      readFileSync : function(file) { return files[file]; },
      existsSync : function() { return true;}
    };

    let actual = getFileData(["-c3", "file1", "file2"], fs, "head");
    let expectedOutput = ["==> file1 <==\nA\nB", "==> file2 <==\na\nb"];
    deepEqual(actual, expectedOutput);

    input = getFileData(["-n3", "file1", "file2"], fs, "head");
    expectedOutput = [
      "==> file1 <==\nA\nB\nC",
      "==> file2 <==\na\nb\nc"
    ];
    deepEqual(input, expectedOutput);
  });

  it("should return error message if file doesn't exist for single file", () => {
    
    let fs = {
      existsSync : function() { return false;}
    };

    let actual = getFileData(["-c3", "file1"], fs, "head");
    let expectedOutput = ["head: file1: No such file or directory"];
    deepEqual(actual, expectedOutput);
  });

  it("should return error message if file doesn't exist if more than one file provided", () => {
    
    let fs = {
      existsSync : function() { return false;}
    };

    let actual = getFileData(["-c3", "file1","file2"], fs, "head");
    let expectedOutput = ["head: file1: No such file or directory",
                          "head: file2: No such file or directory"];
    deepEqual(actual, expectedOutput);
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
    let expectedOutput = [];
    deepEqual(actual, expectedOutput);
  });

  it("should return empty array if 0 as a count is provided with option -n", () => {
    
    let fs = {
      readFileSync : function(file) { return files[file]; },
      existsSync : function() { return true;}
    };
    
    let actual = getFileData(["-n0", "file1"], fs, "tail");
    let expectedOutput = [];
    deepEqual(actual, expectedOutput);
  });

  it("should return the file data if -n input is given with length and files", () => {
    
    let fs = {
      readFileSync : function(file) { return files[file]; },
      existsSync : function() { return true;}
    };

    let actual = getFileData(["-c3", "file3"], fs, "tail");
    let expectedOutput = ["ine"];
    deepEqual(actual, expectedOutput);
  });

  it("should return the file data if -n input is given with length and files", () => {
    
    let fs = {
      readFileSync : function(file) { return files[file]; },
      existsSync : function() { return true;}
    };

    let actual = getFileData(["-n2", "file1"], fs, "tail");
    let expectedOutput = ["O\nP"];
    deepEqual(actual, expectedOutput);
  });

  it("should return the file content in default case of length 10", () => {
    
    let fs = {
      readFileSync : function(file) { return files[file]; },
      existsSync : function() { return true;}
    };
    
    let actual = getFileData(["file1"], fs, "tail");
    let expectedOutput = ["G\nH\nI\nJ\nK\nL\nM\nN\nO\nP"];
    deepEqual(actual, expectedOutput);
  });

  it("should return error message if type is -n and length is not provided", () => {
    
    let fs = {
      readFileSync : function(file) { return files[file]; },
      existsSync : function() { return true;}
    };
    
    let actual = getFileData(["-n", "file1"], fs, "tail");
    let expectedOutput = ["tail: illegal offset -- file1"];
    deepEqual(actual, expectedOutput);
  });

  it("should return file content with header if more than two files are provided", () => {
    
    let fs = {
      readFileSync : function(file) { return files[file]; },
      existsSync : function() { return true;}
    };

    let actual = getFileData(["-c3", "file2", "file3"], fs, "tail");
    let expectedOutput = ["==> file2 <==\no\np", "==> file3 <==\nine"];
    deepEqual(actual, expectedOutput);

    actual = getFileData(["-n3", "file1", "file2"], fs, "tail");
    expectedOutput = [
      "==> file1 <==\nN\nO\nP",
      "==> file2 <==\nn\no\np"
    ];
    deepEqual(actual, expectedOutput);
  });

  it("should return error message if file doesn't exist for single file", () => {
    
    let fs = {
      existsSync : function() { return false;}
    };

    let actual = getFileData(["-c3", "file1"], fs, "tail");
    let expectedOutput = ["tail: file1: No such file or directory"];
    deepEqual(actual, expectedOutput);
  });

  it("should return error message if file doesn't exist if more than one file provided", () => {
    
    let fs = {
      existsSync : function() { return false;}
    };

    let actual = getFileData(["-c3", "file1","file2"], fs, "tail");
    let expectedOutput = ["tail: file1: No such file or directory",
                          "tail: file2: No such file or directory"];
    deepEqual(actual, expectedOutput);
  });
});

describe("getOptionFuncRefForHead", () => {
  it("should return function reference for extractHeadCharacters if -c option is provided", () => {
    deepEqual(getOptionFuncRefForHead("-c"), extractHeadCharacters);
  });

  it("should return function reference for extractHeadLines if -n option is provided", () => {
    deepEqual(getOptionFuncRefForHead("-n"), extractHeadLines);
  });
});

describe("isCountAboveZero", () => {
  it("should return true if given input is greater than zero", () => {
    deepEqual(isCountAboveZero(3), true);
    deepEqual(isCountAboveZero(1), true);
  });

  it("should return false if given input is lesser than zero", () => {
    deepEqual(isCountAboveZero(-3), false);
    deepEqual(isCountAboveZero(-1), false);
  });
});

describe("isFileExists", () => {
  it("should return true if it finds the file", () => {
  
    let fs = {
      existsSync : function() { return true;}
    };
    
    equal(isFileExists(fs.existsSync, "file"), true);
  });

  it("should return false if it can't find the file", () => {
  
    let fs = {
      existsSync : function() { return false;}
    };
    
    equal(isFileExists(fs.existsSync, "file"), false);
  });
});

describe("extractContents returns contents as per the delimiter it has passed", () => {
  it("should return contents separated by \n for head", () => {
    deepEqual(
      extractContents("first line\nsecond line", "\n", 0, 2),
      "first line\nsecond line"
    );
  });

  it("should return contents separated by character for head", () => {
    deepEqual(extractContents("first line\nsecond line", "", 0, 5), "first");
  });
});

describe("extractTailLines returns lines of given text as per the given input", () => {
  it("should return whole content when 0 count is provided", () => {
    deepEqual(
      extractTailLines(0, "first line\nsecond line"),
      "first line\nsecond line"
    );
  });

  it("should return one line for count 1", () => {
    deepEqual(extractTailLines(1, "first line\nsecond line"), "second line");
  });

  it("should return number of lines as per the given count", () => {
    deepEqual(
      extractTailLines(2, "first line\nsecond line"),
      "first line\nsecond line"
    );
    deepEqual(
      extractTailLines(4, "first\nline\nsecond\nline"),
      "first\nline\nsecond\nline"
    );
  });
});

describe("extractTailCharacters returns characters of given text as per the given input length", () => {
  it("should return whole string for 0 length input", () => {
    deepEqual(
      extractTailCharacters(0, "first line\nsecond line"),
      "first line\nsecond line"
    );
  });

  it("should return one character for length as input 1", () => {
    deepEqual(extractTailCharacters(1, "first line\nsecond line"), "e");
  });

  it("should return number of characters as per the given length", () => {
    deepEqual(extractTailCharacters(2, "first line\nsecond line"), "ne");
    deepEqual(extractTailCharacters(5, "first\nline\nsecond\nline"), "\nline");
  });
});

describe("getOptionFuncRefForTail", () => {
  it("should return function reference for extractHeadCharacters if -c option is provided", () => {
    deepEqual(getOptionFuncRefForTail("-c"), extractTailCharacters);
  });

  it("should return function reference for extractHeadLines if -n option is provided", () => {
    deepEqual(getOptionFuncRefForTail("-n"), extractTailLines);
  });
});

describe("getFuncRef", () => {
  it("should return function reference for head command with option -n", () => {
    deepEqual(getFuncRef("head", "-n"), extractHeadLines);
  });

  it("should return function reference for head command with option -c", () => {
    deepEqual(getFuncRef("head", "-c"), extractHeadCharacters);
  });

  it("should return function reference for tail command with option -n", () => {
    deepEqual(getFuncRef("tail", "-n"), extractTailLines);
  });

  it("should return function reference for tail command with option -c", () => {
    deepEqual(getFuncRef("tail", "-c"), extractTailCharacters);
  });
});

describe("format", function() {
  let fs = {
    readline: function() {
      return "one\ntwo\nthree";
    }
  };
  it("should add header and return content of given file", function() {
    let expectedOutput = "==> words <==\none";
    let fileName = "words";
    deepEqual(
      format(fs.readline, extractHeadCharacters, fileName, 3),
      expectedOutput
    );

    expectedOutput = "==> numbers <==\ntwo\nthree";
    fileName = "numbers";
    deepEqual(
      format(fs.readline, extractTailLines, fileName, 2),
      expectedOutput
    );
  });
});
