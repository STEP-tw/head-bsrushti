const {equal, deepEqual} = require('assert');
const { 
  classifyDetails,
  extractNLines,
  extractNCharacters,
  readFile,
  makeHeader,
  extractOption
} = require('../src/lib.js'); 

let returnConstant = function(constant){ return constant; }; 

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

describe('readFile returns the result as per the mapper function', () => {
  it('should return same output as per the input', () => {
    deepEqual(readFile(returnConstant,[0,0,0]),[0,0,0]);
    deepEqual(readFile(returnConstant,['a','a','a']),['a','a','a']);
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
