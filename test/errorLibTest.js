const {equal, deepEqual} = require('assert');
const {
    invalidCountError,
    fileNotFoundError,
    getInvalidCountError
} = require('../src/errorLib.js');

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
  
  describe('fileNotFoundError', () => {
    it('should return error message if it not finds the file', () => {
      equal(fileNotFoundError('file','head'),'head: file: No such file or directory');
    });
  });
  
  describe('getInvalidCountError', function() {
      it('should return error message according to given params', function() {
        equal(getInvalidCountError('-n','1q','tail'),'tail: illegal offset -- 1q');
        equal(getInvalidCountError('-n','aaa','head'),'head: illegal line count -- aaa'); 
      });
  });