const {equal, deepEqual} = require('assert');
const { 
  classifyDetails,
  extractHeadLines,
  extractHeadCharacters,
  apply,
  makeHeader,
  extractOption,
  extractCount,
  extractFiles,
  head,
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
  extractTailCharacters
} = require('../src/lib.js'); 

let fs = {
  existsSync : (file) => true ,
  readFileSync : (file) => 'first line\nsecond line' ,
};

describe('classifyDetails categorizes the input according to its characteristics', () => {
  it('should return object of assigned details of one file', () => {
    let expectedOutput = { option : '-n', count : 1, files : ['file1'] }
    deepEqual(classifyDetails(['-n','1','file1']),expectedOutput);
  });

  it('should return object of assigned details for more than one file', () => {
    let expectedOutput = { option : '-n', count : 1, files : ['file1','file2','file3'] }
    deepEqual(classifyDetails(['-n','1','file1','file2','file3']),expectedOutput);
  });
});

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

describe('apply returns the result as per the mapper function', () => {
  it("should return file content with header if more than one files are given", () => {
    deepEqual(apply(fs, 'file', 2, extractHeadCharacters,3),'==> file <==\nfir');
  });
  it('should return file content as per the input', () => {
    deepEqual(apply(fs,'file1', 1, extractHeadLines,1),'first line');
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
    equal(extractOption(['file1', 'file2']),'-n');
    equal(extractOption(['-', 'file1', 'file2']),'-n');
  });

  it('should return -n if -n option is  mentioned in input', () => {
    equal(extractOption(['-n', 'file1', 'file2']),'-n');
    equal(extractOption(['-n5', 'file1', 'file2']),'-n');
  });

  it('should return -c if -c option is  mentioned in input', () => {
    equal(extractOption(['-c', 'file1', 'file2']),'-c');
    equal(extractOption(['-c5', 'file1', 'file2']),'-c');
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

describe('head', () => {
  it('should return the file data if -n input is given with length and files', () => {
    let input = head(['-c3','file1'],fs);
    let expectedOutput = ['fir']; 
    deepEqual(input, expectedOutput);
  });

  it('should return the file data if -n input is given with length and files', () => {
    let input = head(['-n2','file1'],fs);
    let expectedOutput = ['first line\nsecond line']; 
    deepEqual(input, expectedOutput);
  });

  it('should return the file content in default case of length 10', () => {
    let input = head(['file1'],fs);
    let expectedOutput = ['first line\nsecond line']; 
    deepEqual(input, expectedOutput);
  });

  it('should return error message if type is -n and length is not provided', () => {
    let input = head(['-n','file1'],fs);
    let expectedOutput = ['head: illegal line count -- file1']; 
    deepEqual(input, expectedOutput);
  });

  it('should return file content with header if more than two files are provided', () => {
    let input = head(['-c3','file1','file2'], fs);
    let expectedOutput = [ '==> file1 <==\nfir', '==> file2 <==\nfir' ];
    deepEqual(input, expectedOutput);

    input = head(['-n3','file1','file2'], fs);
    expectedOutput = [ '==> file1 <==\nfirst line\nsecond line',
                       '==> file2 <==\nfirst line\nsecond line' ];
    deepEqual(input, expectedOutput);

  });
});

describe('getOptionFuncRef', () => {
  it('should return function reference for extractHeadCharacters if -c option is provided', () => {
    deepEqual(getOptionFuncRef('-c'), extractHeadCharacters);
  });

  it('should return function reference for extractHeadLines if -n option is provided', () => {
    deepEqual(getOptionFuncRef('-n'), extractHeadLines);
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
  it('should return error message if invalid length provided with option -c', () => {
    equal(invalidCountError('-c','1q'),'head: illegal byte count -- 1q');
    equal(invalidCountError('-c','aaa'),'head: illegal byte count -- aaa');
  });
  
  it('should return error message if invalid length provided with option -n', () => {
    equal(invalidCountError('-n','1q'),'head: illegal line count -- 1q');
    equal(invalidCountError('-n','aaa'),'head: illegal line count -- aaa');
  });
});

describe('isFileExists', () => {
  it('should return true if it finds the file', () => {
    equal(isFileExists(fs.existsSync,file),true);
  });
});

describe('fileNotFoundError', () => {
  it('should return error message if it not finds the file', () => {
    equal(fileNotFoundError('file'),'head: file: No such file or directory');
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

describe('isDetailsStartsWithHyphen', () => {
  it('should returns true if given input starts with hyphen', () => {
    equal(isDetailsStartsWithHyphen(['-abc']),true);
    equal(isDetailsStartsWithHyphen(['-a-b-c']),true);
  });

  it('should returns false if given input not starts with hyphen', () => {
    equal(isDetailsStartsWithHyphen(['abc-']),false);
    equal(isDetailsStartsWithHyphen(['a-b-c']),false);
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
