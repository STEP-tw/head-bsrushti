const {equal, deepEqual} = require('assert');
const {invalidCountError} = require('../src/errorLib.js');

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
  