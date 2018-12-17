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
    let actual = extractHeadLines(0, "first line\nsecond line");
    let expected = ""; 
    deepEqual(actual, expected);
  });

  it("should return one line for length as input 1", () => {
    let actual = extractHeadLines(1, "first line\nsecond line");
    let expected = "first line";
    deepEqual(actual, expected);
  });

  it("should return empty line for invalid length(negative)", () => {
    let actual = extractHeadLines(-1, "first line\nsecond line"); 
    let expected = "";
    deepEqual(actual, expected);
  });

  it("should return number of lines as per the given length", () => {
    let actual = extractHeadLines(2, "first line\nsecond line");
    let expected = "first line\nsecond line";
    deepEqual(actual, expected);

    actual = extractHeadLines(4, "first\nline\nsecond\nline");
    expected = "first\nline\nsecond\nline";
    deepEqual(actual, expected);
  });
});

describe("extractHeadCharacters returns characters of given text as per the given input length", () => {
  it("should return empty string for 0 length input", () => {
    let actual = extractHeadCharacters(0, "first line\nsecond line");
    let expected = "";
    deepEqual(actual, expected);
  });

  it("should return one character for length as input 1", () => {
    let actual = extractHeadCharacters(1, "first line\nsecond line");
    let expected = "f";
    deepEqual(actual, expected);
  });

  it("should return empty character for invalid length(negative)", () => {
    let actual = extractHeadCharacters(-1, "first line\nsecond line");
    let expected = "";
    deepEqual(actual, expected);
  });

  it("should return number of characters as per the given length", () => {
    let actual = extractHeadCharacters(2, "first line\nsecond line");
    let expected = "fi";
    deepEqual(actual, expected);
    
    actual = extractHeadCharacters(5, "first\nline\nsecond\nline");
    expected = "first";
    deepEqual(actual, expected);
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
    deepEqual(actual, expected);
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

describe("getOptionFuncRefForHead", () => {
  it("should return function reference for extractHeadCharacters if -c option is provided", () => {
    let actual = getOptionFuncRefForHead("-c");
    let expected = extractHeadCharacters;
    deepEqual(actual, expected);
  });

  it("should return function reference for extractHeadLines if -n option is provided", () => {
    let actual = getOptionFuncRefForHead("-n");
    let expected = extractHeadLines;
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

describe("extractContents returns contents as per the delimiter it has passed", () => {
  it("should return contents separated by \n for head", () => {
   let actual = extractContents("first line\nsecond line", "\n", 0, 2);
   let expected = "first line\nsecond line";
    deepEqual(actual, expected);
  });

  it("should return contents separated by character for head", () => {
    let actual = extractContents("first line\nsecond line", "", 0, 5);
    let expected = "first";
    deepEqual(actual, expected);
  });
});

describe("extractTailLines returns lines of given text as per the given input", () => {
  it("should return whole content when 0 count is provided", () => {
    let actual = extractTailLines(0, "first line\nsecond line");
    let expected = "first line\nsecond line";
    deepEqual(actual, expected);
  });

  it("should return one line for count 1", () => {
    let actual = extractTailLines(1, "first line\nsecond line");
    let expected = "second line";
    deepEqual(actual, expected);
  });

  it("should return number of lines as per the given count", () => {
    let actual = extractTailLines(2, "first line\nsecond line");
    let expected = "first line\nsecond line";
    deepEqual(actual, expected);

    actual = extractTailLines(4, "first\nline\nsecond\nline");
    expected = "first\nline\nsecond\nline";
    deepEqual(actual, expected);
  });
});

describe("extractTailCharacters returns characters of given text as per the given input length", () => {
  it("should return whole string for 0 length input", () => {
    let actual = extractTailCharacters(0, "first line\nsecond line");
    let expected = "first line\nsecond line";
    deepEqual(actual, expected);
  });

  it("should return one character for length as input 1", () => {
    let actual = extractTailCharacters(1, "first line\nsecond line");
    let expected = "e";
    deepEqual(actual, expected);
  });

  it("should return number of characters as per the given length", () => {
    let actual = extractTailCharacters(2, "first line\nsecond line");
    let expected = "ne";
    deepEqual(actual, expected);

    actual = extractTailCharacters(5, "first\nline\nsecond\nline");
    expected = "\nline";
    deepEqual(actual, expected);
  });
});

describe("getOptionFuncRefForTail", () => {
  it("should return function reference for extractHeadCharacters if -c option is provided", () => {
    let actual = getOptionFuncRefForTail("-c");
    let expected = extractTailCharacters; 
    deepEqual(actual, expected);
  });

  it("should return function reference for extractHeadLines if -n option is provided", () => {
    let actual = getOptionFuncRefForTail("-n");
    let expected = extractTailLines;
    deepEqual(actual, expected);
  });
});

describe("getFuncRef", () => {
  it("should return function reference for head command with option -n", () => {
    let actual = getFuncRef("head", "-n");
    let expected = extractHeadLines;
    deepEqual(actual, expected);
  });

  it("should return function reference for head command with option -c", () => {
    let actual = getFuncRef("head", "-c");
    let expected = extractHeadCharacters;
    deepEqual(actual, expected);
  });

  it("should return function reference for tail command with option -n", () => {
    let actual = getFuncRef("tail", "-n");
    let expected = extractTailLines;
    deepEqual(actual, expected);
  });

  it("should return function reference for tail command with option -c", () => {
    let actual = getFuncRef("tail", "-c");
    let expected = extractTailCharacters;
    deepEqual(actual, expected);
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
    let actual = format(fs.readline, extractHeadCharacters, fileName, 3);
    let expected = "==> words <==\none";
    
    deepEqual(actual, expected);

    fileName = "numbers";
    expected = "==> numbers <==\ntwo\nthree";
    actual = format(fs.readline, extractTailLines, fileName, 2);
    deepEqual(actual, expected);
  });
});
