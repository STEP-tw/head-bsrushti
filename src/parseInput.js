const isDetailsStartsWithHyphen = function(params) {
  return params[0].startsWith("-");
};

module.exports = { isDetailsStartsWithHyphen };