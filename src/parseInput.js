const isDetailsStartsWithHyphen = function(param) {
  return param.startsWith("-");
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

const parseInputs = function(params) {
  const firstArg = params[0];
  const defaultOptions = { option: "-n", count: 10, fileNames: params };
  
  if (isNumberOption(firstArg)) {
    return {
      option: "-n",
      count: firstArg.slice(1),
      fileNames: params.slice(1)
    };
  }
    
  if (isOptionWithoutCount(params[0])) {
    return {
      option: firstArg.slice(0, 2),
      count: params[1],
      fileNames: params.slice(2)
    };
  }

  if (isOptionWithCount(firstArg)) {
    return {
      option: firstArg.slice(0, 2),
      count: firstArg.substr(2),
      fileNames: params.slice(1)
    };
  }

  return defaultOptions;
};

module.exports = {
  isDetailsStartsWithHyphen,
  isNumberOption,
  isOptionWithCount,
  isOptionWithoutCount,
  parseInputs
};
