const {equal, deepEqual} = require('assert');
const { 
  classifyDetails,
  extractNLines    
} = require('../src/lib.js'); 

describe('classifyDetails categories the input according to characteristics', () => {
  it('should return empty object for no input', () => {
    deepEqual(classifyDetails(),{});
  });

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
