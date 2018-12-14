const {deepEqual} = require('assert');
const { isDetailsStartsWithHyphen } = require('../src/parseInput.js');

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