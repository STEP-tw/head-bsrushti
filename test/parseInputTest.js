const {deepEqual} = require('assert');
const { 
    isDetailsStartsWithHyphen,
    isNumberOption,
    isOptionWithCount,
    isOptionWithoutCount
} = require('../src/parseInput.js');

describe('isDetailsStartsWithHyphen', () => {
    it('should returns true if given input starts with hyphen', () => {
        deepEqual(isDetailsStartsWithHyphen(['-abc']), true);
        deepEqual(isDetailsStartsWithHyphen(['-a-b-c']), true);
    });

    it('should returns false if given input not starts with hyphen', () => {
        deepEqual(isDetailsStartsWithHyphen(['abc-']), false);
        deepEqual(isDetailsStartsWithHyphen(['a-b-c']), false);
    });
});

describe('isNumberOption', function() {
    it('should return true if given argument has number after hyphen', function() {
        deepEqual(isNumberOption('-5'),true);
    });

    it('should return false if given argument has not a number after hyphen', function() {
        deepEqual(isNumberOption('-a'),false);
    });
});

describe('isOptionWithCount', function() {
    it('should return true if given argument has number after hyphen with option', function() {
        deepEqual(isOptionWithCount('-n5'),true);
    });

    it('should return false if given argument has not a number after hyphen with option', function() {
        deepEqual(isOptionWithCount('-n'),false);
    });
});

describe('isOptionWithoutCount', function() {
    it('should return true if given argument has only valid option without count', function() {
        deepEqual(isOptionWithoutCount('-n'),true);
    });

    it('should return false if given argument has not a valid option', function() {
        deepEqual(isOptionWithoutCount('-n5'),false);
    });
});