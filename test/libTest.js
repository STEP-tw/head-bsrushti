const {equal, deepEqual} = require('assert');
const { 
  classifyDetails,
  extractLines,
  extractCharacters,
  apply,
  makeHeader,
  extractOption,
  extractCount,
  extractFiles,
  getErrors,
  printStructuredData,
  getOptionFuncRef,
  isCountAboveZero,
  invalidCountError,
  fileNotFoundError,
  isFileExists,
  isValidLength,
  isIncludesZero
} = require('../src/lib.js'); 

let fs = {
  existsSync : (file) => true ,
  readFileSync : (file) => 'first line\nsecond line' ,
};
describe('classifyDetails categories the input according to characteristics', () => {
  it('should return object of assigned details of file 1', () => {
    let expectedOutput = { option : '-n', length : 1, files : ['file1'] }
    deepEqual(classifyDetails(['-n','1','file1']),expectedOutput);
  });

  it('should return object of assigned details with more than one file', () => {
    let expectedOutput = { option : '-n', length : 1, files : ['file1','file2','file3'] }
    deepEqual(classifyDetails(['-n','1','file1','file2','file3']),expectedOutput);
  });
});

describe('extractLines returns lines of given text as per the given input', () => {
  it('should return empty string for 0 length input', () => {
    deepEqual(extractLines(0,'first line\nsecond line'),'');
  });

  it('should return one line for length as input 1', () => {
    deepEqual(extractLines(1,'first line\nsecond line'),'first line');
  });

  it('should return empty line for invalid length(negative)', () => {
    deepEqual(extractLines(-1,'first line\nsecond line'),'');
  });

  it('should return number of lines as per the given length', () => {
    deepEqual(extractLines(2,'first line\nsecond line'),'first line\nsecond line');
    deepEqual(extractLines(4,'first\nline\nsecond\nline'),'first\nline\nsecond\nline');
  });
});

describe('extractCharacters returns characters of given text as per the given input length', () => {
  it('should return empty string for 0 length input', () => {
    deepEqual(extractCharacters(0,'first line\nsecond line'),'');
  });

  it('should return one character for length as input 1', () => {
    deepEqual(extractCharacters(1,'first line\nsecond line'),'f');
  });

  it('should return empty character for invalid length(negative)', () => {
    deepEqual(extractCharacters(-1,'first line\nsecond line'),'');
  });

  it('should return number of characters as per the given length', () => {
    deepEqual(extractCharacters(2,'first line\nsecond line'),'fi');
    deepEqual(extractCharacters(5,'first\nline\nsecond\nline'),'first');
  });
});

describe('apply returns the result as per the mapper function', () => {
  it("should return file content with header if more than two files are given", () => {
    deepEqual(apply(fs, 'file', 2, extractCharacters,3),'==> file <==\nfir');
  });
  it('should return file content as per the input', () => {
    deepEqual(apply(fs,'file1', 1,extractLines,1),'first line');
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
  it('should return -n default if option is not mentioned in input', () => {
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

describe('getErrors', () => {
  it('should return error message if type is -c and invalid length is provided', () => {
    deepEqual(getErrors(['-c1s','file1'],'1s'),'head: illegal byte count -- 1s');     
  });

  it('should return error message if type is -n and length invalid is provided', () => {
    deepEqual(getErrors(['-n1s','file1'],'1s'),'head: illegal line count -- 1s');     
  });

  it('should return error message if type is -n and length is not provided', () => {
    deepEqual(getErrors(['-n','file1'],'file1'),'head: illegal line count -- file1');     
  });

  it('should return error message if type is -c and length is not provided', () => {
    deepEqual(getErrors(['-c','file1'],'file1'),'head: illegal byte count -- file1');     
  });
});

describe('printStructuredData', () => {
  it('should return the file data if -n input is given with length and files', () => {
    let input = printStructuredData(extractCharacters,['-n3','file1'],fs);
    let expectedOutput = ['fir']; 
    deepEqual(input, expectedOutput);
  });

  it('should return the file data if -n input is given with length and files', () => {
    let input = printStructuredData(extractLines,['-n2','file1'],fs);
    let expectedOutput = ['first line\nsecond line']; 
    deepEqual(input, expectedOutput);
  });

  it('should return the file content in default case of length 10', () => {
    let input = printStructuredData(extractLines,['file1'],fs);
    let expectedOutput = ['first line\nsecond line']; 
    deepEqual(input, expectedOutput);
  });

  it('should return error message if type is -n and length is not provided', () => {
    let input = printStructuredData(extractLines,['-n','file1'],fs);
    let expectedOutput = ['head: illegal line count -- file1']; 
    deepEqual(input, expectedOutput);
  });

  it('should return file content with header if more than two files are provided', () => {
    let input = printStructuredData(
      extractCharacters,
      ['-c3','file1','file2'],
      fs
    );
    let expectedOutput = [ '==> file1 <==\nfir', '==> file2 <==\nfir' ];
    deepEqual(input, expectedOutput);

    input = printStructuredData(
      extractLines,
      ['-n3','file1','file2'],
      fs
    );
    expectedOutput = [ '==> file1 <==\nfirst line\nsecond line',
                       '==> file2 <==\nfirst line\nsecond line' ];
    deepEqual(input, expectedOutput);

  });
});

describe('getOptionFuncRef', () => {
  it('should return function reference for extractCharacters if -c option is provided', () => {
    deepEqual(getOptionFuncRef('-c'), extractCharacters);
  });

  it('should return function reference for extractLines if -n option is provided', () => {
    deepEqual(getOptionFuncRef('-n'), extractLines);
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

describe('isValidLength function return false if illegal line count is provided', () => {
  it('should return false if invalid line count is provided', () => {
    deepEqual(isValidLength('-n'),false);
  });

  it('should return true if valid line count is provided', () => {
    deepEqual(isValidLength('-n2'),true);
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
