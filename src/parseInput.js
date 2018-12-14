const isDetailsStartsWithHyphen = function(params) {
  return params[0].startsWith("-");
};

const isNumberOption = function(option) {
    return isDetailsStartsWithHyphen(option) && !isNaN(option[1]);
};

module.exports = { 
    isDetailsStartsWithHyphen,
    isNumberOption
 };