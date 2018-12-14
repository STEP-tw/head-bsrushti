const {equal, deepEqual} = require('assert');
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
} = require('../src/lib.js'); 

let fs = {
  existsSync : (file) => true ,
  readFileSync : (file) => 'first line\nsecond line' ,
};

describe('extractHeadLines returns lines of given text as per the given input', () => {
  it('should return empty string for 0 length input', () => {
    deepEqual(extractHeadLines(0,'first line\nsecond line'),'');
  });

  it('should return one line for length as input 1', () => {
    deepEqual(extractHeadLines(1,'first line\nsecond line'),'first line');
  });

  it('should return empty line for invalid length(negative)', () => {
    deepEqual(extractHeadLines(-1,'first line\nsecond line'),'');
  });

  it('should return number of lines as per the given length', () => {
    deepEqual(extractHeadLines(2,'first line\nsecond line'),'first line\nsecond line');
    deepEqual(extractHeadLines(4,'first\nline\nsecond\nline'),'first\nline\nsecond\nline');
  });
});

describe('extractHeadCharacters returns characters of given text as per the given input length', () => {
  it('should return empty string for 0 length input', () => {
    deepEqual(extractHeadCharacters(0,'first line\nsecond line'),'');
  });

  it('should return one character for length as input 1', () => {
    deepEqual(extractHeadCharacters(1,'first line\nsecond line'),'f');
  });

  it('should return empty character for invalid length(negative)', () => {
    deepEqual(extractHeadCharacters(-1,'first line\nsecond line'),'');
  });

  it('should return number of characters as per the given length', () => {
    deepEqual(extractHeadCharacters(2,'first line\nsecond line'),'fi');
    deepEqual(extractHeadCharacters(5,'first\nline\nsecond\nline'),'first');
  });
});

describe('getFilteredContent returns the result as per the mapper function', () => {
  it("should return file content with header if more than one are given", () => {
    deepEqual(getFilteredContent(fs, 'file', 2, extractHeadCharacters,3,'head'),'==> file <==\nfir');
  });

  it('should return file content as per the input', () => {
    deepEqual(getFilteredContent(fs,'file1', 1, extractHeadLines,1,'tail'),'first line');
  });

  it("should return error when file doesn't exist" , () => {
    const fs = {
      existsSync : function(file) { return false }
    };
    let expectedOutput = 'tail: file1: No such file or directory';
    deepEqual(getFilteredContent(fs,'file1', 1, extractHeadLines,1,'tail'),expectedOutput);
  });
});

describe('makeHeading gives header along with title', () => {
  it('should return heading with two spaces if empty title(empty string) is given', () => {
    equal(makeHeader(''),"==>  <==");
  });

  it('should return heading to given title', () => {
    equal(makeHeader('abc'),"==> abc <==");
    equal(makeHeader('file1'),"==> file1 <==");
  });
});

describe('getFileData for head', () => {
  it('should return the file data if -n input is given with length and files', () => {
    let input = getFileData(['-c3','file1'],fs,'head');
    let expectedOutput = ['fir']; 
    deepEqual(input, expectedOutput);
  });

  it('should return the file data if -n input is given with length and files', () => {
    let input = getFileData(['-n2','file1'],fs,'head');
    let expectedOutput = ['first line\nsecond line']; 
    deepEqual(input, expectedOutput);
  });

  it('should return the file content in default case of length 10', () => {
    let input = getFileData(['file1'],fs,'head');
    let expectedOutput = ['first line\nsecond line']; 
    deepEqual(input, expectedOutput);
  });

  it('should return error message if type is -n and length is not provided', () => {
    let input = getFileData(['-n','file1'],fs,'head');
    let expectedOutput = ['head: illegal line count -- file1']; 
    deepEqual(input, expectedOutput);
  });

  it('should return file content with header if more than two files are provided', () => {
    let input = getFileData(['-c3','file1','file2'], fs,'head');
    let expectedOutput = [ '==> file1 <==\nfir', '==> file2 <==\nfir' ];
    deepEqual(input, expectedOutput);

    input = getFileData(['-n3','file1','file2'], fs,'head');
    expectedOutput = [ '==> file1 <==\nfirst line\nsecond line',
                       '==> file2 <==\nfirst line\nsecond line' ];
    deepEqual(input, expectedOutput);

  });
});

describe('getFileData for tail', () => {
  it('should return empty array if 0 as a count is provided with option -c', () => {
    let input = getFileData(['-c0','file1'],fs,'tail');
    let expectedOutput = []; 
    deepEqual(input, expectedOutput);
  });

  it('should return empty array if 0 as a count is provided with option -n', () => {
    let input = getFileData(['-n0','file1'],fs,'tail');
    let expectedOutput = []; 
    deepEqual(input, expectedOutput);
  });

  it('should return the file data if -n input is given with length and files', () => {
    let input = getFileData(['-c3','file1'],fs,'tail');
    let expectedOutput = ['ine']; 
    deepEqual(input, expectedOutput);
  });

  it('should return the file data if -n input is given with length and files', () => {
    let input = getFileData(['-n2','file1'],fs,'tail');
    let expectedOutput = ['first line\nsecond line']; 
    deepEqual(input, expectedOutput);
  });

  it('should return the file content in default case of length 10', () => {
    let input = getFileData(['file1'],fs,'tail');
    let expectedOutput = ['first line\nsecond line']; 
    deepEqual(input, expectedOutput);
  });

  it('should return error message if type is -n and length is not provided', () => {
    let input = getFileData(['-n','file1'],fs,'tail');
    let expectedOutput = ['tail: illegal offset -- file1']; 
    deepEqual(input, expectedOutput);
  });

  it('should return file content with header if more than two files are provided', () => {
    let input = getFileData(['-c3','file1','file2'], fs,'tail');
    let expectedOutput = [ '==> file1 <==\nine', '==> file2 <==\nine' ];
    deepEqual(input, expectedOutput);

    input = getFileData(['-n3','file1','file2'], fs,'tail');
    expectedOutput = [ '==> file1 <==\nfirst line\nsecond line',
                       '==> file2 <==\nfirst line\nsecond line' ];
    deepEqual(input, expectedOutput);

  });
});

describe('getOptionFuncRefForHead', () => {
  it('should return function reference for extractHeadCharacters if -c option is provided', () => {
    deepEqual(getOptionFuncRefForHead('-c'), extractHeadCharacters);
  });

  it('should return function reference for extractHeadLines if -n option is provided', () => {
    deepEqual(getOptionFuncRefForHead('-n'), extractHeadLines);
  });
});

describe('isCountAboveZero', () => {
  it('should return true if given input is greater than zero', () => {
    deepEqual(isCountAboveZero(3),true);
    deepEqual(isCountAboveZero(1),true);
  });

  it('should return false if given input is lesser than zero', () => {
    deepEqual(isCountAboveZero(-3),false);
    deepEqual(isCountAboveZero(-1),false);
  });
});

describe('isFileExists', () => {
  it('should return true if it finds the file', () => {
    equal(isFileExists(fs.existsSync,file),true);
  });
});

describe('extractContents returns contents as per the delimiter it has passed', () => {
  it('should return contents separated by \n for head', () => {
    deepEqual(extractContents('first line\nsecond line',"\n", 0, 2),'first line\nsecond line');
  });

  it('should return contents separated by character for head', () => {
    deepEqual(extractContents('first line\nsecond line',"", 0, 5),'first');
  });
});

describe('extractTailLines returns lines of given text as per the given input', () => { 
  it('should return whole content when 0 count is provided', () => {
    deepEqual(extractTailLines(0,'first line\nsecond line'),'first line\nsecond line');
  });

  it('should return one line for count 1', () => {
    deepEqual(extractTailLines(1,'first line\nsecond line'),'second line');
  });

  it('should return number of lines as per the given count', () => {
    deepEqual(extractTailLines(2,'first line\nsecond line'),'first line\nsecond line');
    deepEqual(extractTailLines(4,'first\nline\nsecond\nline'),'first\nline\nsecond\nline');
  });
});

describe('extractTailCharacters returns characters of given text as per the given input length', () => {
  it('should return whole string for 0 length input', () => {
    deepEqual(extractTailCharacters(0,'first line\nsecond line'),'first line\nsecond line');
  });

  it('should return one character for length as input 1', () => {
    deepEqual(extractTailCharacters(1,'first line\nsecond line'),'e');
  });

  it('should return number of characters as per the given length', () => {
    deepEqual(extractTailCharacters(2,'first line\nsecond line'),'ne');
    deepEqual(extractTailCharacters(5,'first\nline\nsecond\nline'),'\nline');
  });
});

describe('getOptionFuncRefForTail', () => {
  it('should return function reference for extractHeadCharacters if -c option is provided', () => {
    deepEqual(getOptionFuncRefForTail('-c'), extractTailCharacters);
  });

  it('should return function reference for extractHeadLines if -n option is provided', () => {
    deepEqual(getOptionFuncRefForTail('-n'), extractTailLines);
  });
});

describe('getFuncRef', () => {
  it('should return function reference for head command with option -n', () => {
    deepEqual(getFuncRef('head','-n'),extractHeadLines);
  });

  it('should return function reference for head command with option -c', () => {
    deepEqual(getFuncRef('head','-c'),extractHeadCharacters);
  });

  it('should return function reference for tail command with option -n', () => {
    deepEqual(getFuncRef('tail','-n'),extractTailLines);
  });

  it('should return function reference for tail command with option -c', () => {
    deepEqual(getFuncRef('tail','-c'),extractTailCharacters);
  });
});

describe('format', function() {
  let fs = { readline : function(){ return 'one\ntwo\nthree'; } };
  it('should add header and return content of given file', function() {
    let expectedOutput = '==> words <==\none';
    let fileName = 'words';
    deepEqual(format(fs.readline, extractHeadCharacters, fileName, 3),expectedOutput);
    
    expectedOutput = '==> numbers <==\ntwo\nthree';
    fileName = 'numbers';
    deepEqual(format(fs.readline, extractTailLines, fileName, 2),expectedOutput);
  });
});