const isDetailsStartsWithHyphen = function(params) {
  return params[0].startsWith("-");
};

const isNumberOption = function(option) {
    return isDetailsStartsWithHyphen(option) && !isNaN(option[1]);
};

const isOptionWithCount = function(option) {
    return isDetailsStartsWithHyphen(option) && option.length > 2;
};

const isOptionWithoutCount = function(option) {
    return isDetailsStartsWithHyphen(option) && option.length == 2;
};

module.exports = { 
    isDetailsStartsWithHyphen,
    isNumberOption,
    isOptionWithCount,
    isOptionWithoutCount
 };