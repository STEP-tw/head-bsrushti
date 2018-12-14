const {equal, deepEqual} = require('assert');
const { 
  extractHeadLines,
  extractHeadCharacters,
  getFilteredContent,
  makeHeader,
  extractOption,
  extractCount,
  extractFiles,
  getFileData,
  getOptionFuncRef,
  isCountAboveZero,
  invalidCountError,
  fileNotFoundError,
  isFileExists,
  isValidCount,
  isIncludesZero,
  extractContents,
  getCountFromOption,
  isDetailsStartsWithHyphen,
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

describe('extractOption returns the matched option mentioned in input', () => {
  it('should return -n as default if option is not mentioned in input', () => {
    equal(extractOption('head'),'-n');
    equal(extractOption('-'),'-n');
  });

  it('should return -n if -n option is  mentioned in input', () => {
    equal(extractOption('-n'),'-n');
    equal(extractOption('-n5'),'-n');
  });

  it('should return -c if -c option is  mentioned in input', () => {
    equal(extractOption('-c'),'-c');
    equal(extractOption('-c5'),'-c');
  });
});

describe('extractCount returns the first occurrence of number from string input', () => {
  it('should return itself if no length is provided', () => {
    equal(extractCount(['-n','file']),'file');
  });

  it('should return length if length is provided with option', () => {
    equal(extractCount(['-n1','file']),1);
    equal(extractCount(['-c1','file']),1);
  });

  it('should return length if length is provided with no option', () => {
    equal(extractCount(['-1','file']),1);
    equal(extractCount(['-5','file']),5);
  });

  it('should return invalid length if invalid length is provided with option', () => {
    equal(extractCount(['-n3e','file']),'3e');
    equal(extractCount(['-c3e','file']),'3e');
  });
});

describe('extractFiles function extract the files from given details', () => {
  it('should return file names given in input details', () => {
    deepEqual(extractFiles(['-n1','file1','file2']),['file1','file2']);
  });

  it('should return file names given in input details(options are not given in input)', () => {
    deepEqual(extractFiles(['-n1','file1','file2']),['file1','file2']);
  });

  it('should return file name if only argument is passing as an input', () => {
    deepEqual(extractFiles(['file']),['file']);
  });
});

describe('getFileData', () => {
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

describe('invalidCountError', () => {
  it('should return error message if invalid length provided with option -c and command head', () => {
    equal(invalidCountError('-c','1q','head'),'head: illegal byte count -- 1q');
    equal(invalidCountError('-c','aaa','head'),'head: illegal byte count -- aaa');
  });
  
  it('should return error message if invalid length provided with option -n and command head', () => {
    equal(invalidCountError('-n','1q','head'),'head: illegal line count -- 1q');
    equal(invalidCountError('-n','aaa','head'),'head: illegal line count -- aaa');
  });

  it('should return error message if invalid length provided with option -c and command tail', () => {
    equal(invalidCountError('-c','1q','tail'),'tail: illegal offset -- 1q');
    equal(invalidCountError('-c','aaa','tail'),'tail: illegal offset -- aaa');
  });

  it('should return error message if invalid length provided with option -n and command tail', () => {
    equal(invalidCountError('-n','1q','tail'),'tail: illegal offset -- 1q');
    equal(invalidCountError('-n','aaa','tail'),'tail: illegal offset -- aaa');
  });

});

describe('isFileExists', () => {
  it('should return true if it finds the file', () => {
    equal(isFileExists(fs.existsSync,file),true);
  });
});

describe('fileNotFoundError', () => {
  it('should return error message if it not finds the file', () => {
    equal(fileNotFoundError('file','head'),'head: file: No such file or directory');
  });
});

describe('isValidCount function return false if illegal line count is provided', () => {
  it('should return false if invalid line count is provided', () => {
    deepEqual(isValidCount('-n'),false);
  });

  it('should return true if valid line count is provided', () => {
    deepEqual(isValidCount('-n2'),true);
  });
});

describe('isIncludesZero', () => {
  it('should return true if given input have zero included', () => {
    deepEqual(isIncludesZero('-n0'),true);
  });

  it('should return false if given input have zero included', () => {
    deepEqual(isIncludesZero('-n47'),false);
  });
});

describe('extractContents returns contents as per the delimiter it has passed', () => {
  it('should return contents separated by \n for head', () => {
    deepEqual(extractContents('first line\nsecond line',"\n", 0, 2),'first line\nsecond line');
  });

  it('should return contents separated by character for head', () => {
    deepEqual(extractContents('first line\nsecond line',"", 0, 5),'first');
  });
});makeHeader

describe('getCountFromOption returns count from given valid option', () => {
  it('should returns 10 when no option is provided', () => {
    equal(getCountFromOption('',[]), 10);
  });

  it('should returns positive count when length preceded by -', () => {
    equal(getCountFromOption('-5',['-5']), 5);
    equal(getCountFromOption('-2',['-2']), 2);
  });

  it('should returns positive count when length preceded by - with space between in it', () => {
    equal(getCountFromOption('-5',['-','5']), 5);
    equal(getCountFromOption('-2',['-','2']), 2);
  });

  it('should returns positive count when length preceded by - with option', () => {
    equal(getCountFromOption('-n5',['-n5']), 5);
    equal(getCountFromOption('-n2',['-n2']), 2);
  });

  it('should returns positive count when length preceded by - with option with space between in it', () => {
    equal(getCountFromOption('-n5',['-n','5']), 5);
    equal(getCountFromOption('-n2',['-n','2']), 2);
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
    deepEqual(getFuncRef('head.js','-n'),extractHeadLines);
  });

  it('should return function reference for head command with option -c', () => {
    deepEqual(getFuncRef('head.js','-c'),extractHeadCharacters);
  });

  it('should return function reference for tail command with option -n', () => {
    deepEqual(getFuncRef('tail.js','-n'),extractTailLines);
  });

  it('should return function reference for tail command with option -c', () => {
    deepEqual(getFuncRef('tail.js','-c'),extractTailCharacters);
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