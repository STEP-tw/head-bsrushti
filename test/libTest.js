const {equal, deepEqual} = require('assert');
const { 
  classifyDetails,
  extractNLines,
  extractNCharacters,
  apply,
  makeHeader,
  extractOption,
  extractLength,
  extractFiles,
  getErrors,
  printStructuredData,
  getOptionFuncRef,
  isCountAboveZero,
  invalidCountError,
  fileNotFoundError,
  isFileExists
} = require('../src/lib.js'); 
let returnConstant = function(constant){ return constant; }; 
let fs = {
  existsSync : (file) => true ,
  readFileSync : (file) => 'first line\nsecond line' ,
};
const existsSync = function(file) { 
  return true
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

describe('extractNLines returns lines of given text as per the given input', () => {
  it('should return empty string for 0 length input', () => {
    deepEqual(extractNLines(0,'first line\nsecond line'),'');
  });

  it('should return one line for length as input 1', () => {
    deepEqual(extractNLines(1,'first line\nsecond line'),'first line');
  });

  it('should return empty line for invalid length(negative)', () => {
    deepEqual(extractNLines(-1,'first line\nsecond line'),'');
  });

  it('should return number of lines as per the given length', () => {
    deepEqual(extractNLines(2,'first line\nsecond line'),'first line\nsecond line');
    deepEqual(extractNLines(4,'first\nline\nsecond\nline'),'first\nline\nsecond\nline');
  });
});

describe('extractNCharacters returns characters of given text as per the given input length', () => {
  it('should return empty string for 0 length input', () => {
    deepEqual(extractNCharacters(0,'first line\nsecond line'),'');
  });

  it('should return one character for length as input 1', () => {
    deepEqual(extractNCharacters(1,'first line\nsecond line'),'f');
  });

  it('should return empty character for invalid length(negative)', () => {
    deepEqual(extractNCharacters(-1,'first line\nsecond line'),'');
  });

  it('should return number of characters as per the given length', () => {
    deepEqual(extractNCharacters(2,'first line\nsecond line'),'fi');
    deepEqual(extractNCharacters(5,'first\nline\nsecond\nline'),'first');
  });
});

describe('apply returns the result as per the mapper function', () => {
  it("should return file content with header if more than two files are given", () => {
    deepEqual(apply(fs, 'file', 2, extractNCharacters,3),'==> file <==\nfir');
  });
  it('should return file content as per the input', () => {
    deepEqual(apply(fs,'file1', 1,extractNLines,1),'first line');
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

describe('extractLength returns the first occurrence of number from string input', () => {
  it('should return itself if no length is provided', () => {
    equal(extractLength(['-n','file']),'file');
  });

  it('should return length if length is provided with option', () => {
    equal(extractLength(['-n1','file']),1);
    equal(extractLength(['-c1','file']),1);
  });

  it('should return length if length is provided with no option', () => {
    equal(extractLength(['-1','file']),1);
    equal(extractLength(['-5','file']),5);
  });

  it('should return invalid length if invalid length is provided with option', () => {
    equal(extractLength(['-n3e','file']),'3e');
    equal(extractLength(['-c3e','file']),'3e');
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
    let input = printStructuredData(extractNCharacters,['-n3','file1'],fs);
    let expectedOutput = ['fir']; 
    deepEqual(input, expectedOutput);
  });

  it('should return the file data if -n input is given with length and files', () => {
    let input = printStructuredData(extractNLines,['-n2','file1'],fs);
    let expectedOutput = ['first line\nsecond line']; 
    deepEqual(input, expectedOutput);
  });

  it('should return the file content in default case of length 10', () => {
    let input = printStructuredData(extractNLines,['file1'],fs);
    let expectedOutput = ['first line\nsecond line']; 
    deepEqual(input, expectedOutput);
  });

  it('should return error message if type is -n and length is not provided', () => {
    let input = printStructuredData(extractNLines,['-n','file1'],fs);
    let expectedOutput = ['head: illegal line count -- file1']; 
    deepEqual(input, expectedOutput);
  });

  it('should return file content with header if more than two files are provided', () => {
    let input = printStructuredData(
      extractNCharacters,
      ['-c3','file1','file2'],
      fs
    );
    let expectedOutput = [ '==> file1 <==\nfir', '==> file2 <==\nfir' ];
    deepEqual(input, expectedOutput);

    input = printStructuredData(
      extractNLines,
      ['-n3','file1','file2'],
      fs
    );
    expectedOutput = [ '==> file1 <==\nfirst line\nsecond line',
                       '==> file2 <==\nfirst line\nsecond line' ];
    deepEqual(input, expectedOutput);

  });
});

describe('getOptionFuncRef', () => {
  it('should return function reference for extractNCharacters if -c option is provided', () => {
    deepEqual(getOptionFuncRef('-c'), extractNCharacters);
  });

  it('should return function reference for extractNLines if -n option is provided', () => {
    deepEqual(getOptionFuncRef('-n'), extractNLines);
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
    equal(isFileExists(existsSync,file),true);
  });
});

describe('fileNotFoundError', () => {
  it('should return error message if it not finds the file', () => {
    equal(fileNotFoundError('file'),'head: file: No such file or directory');
  });
});
