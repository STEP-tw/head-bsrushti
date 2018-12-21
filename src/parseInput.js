 const isParamStartsWithHyphen = function(param) {  
  return param.startsWith("-");
};

const isNumberOption = function(option) {
  return isParamStartsWithHyphen(option) && !isNaN(option[1]);
};

const isOptionWithCount = function(option) {
  return isParamStartsWithHyphen(option) && option.length > 2;
};

const isOptionWithoutCount = function(option) {
  return isParamStartsWithHyphen(option) && option.length == 2;
};

const classifyParams = function(option, count, fileNames) {
  return { option, count, fileNames };
};

const parseInputs = function(params) {
  let firstArg = params[0];
  let option = firstArg.slice(0, 2);
  let fileNames = params.slice(1);

  if (isNumberOption(firstArg)) {
    option = "-n";
    let count = firstArg.slice(1);
    return classifyParams(option, count, fileNames);
  };

  if (isOptionWithoutCount(firstArg)) {
    let count = params[1];
    fileNames = params.slice(2);
    return classifyParams(option, count, fileNames);
  };

  if (isOptionWithCount(firstArg)) {
    let count = firstArg.slice(2);
    return classifyParams(option, count, fileNames);
  };

  return classifyParams("-n", 10, params);
};

module.exports = {
  isParamStartsWithHyphen,
  isNumberOption,
  isOptionWithCount,
  isOptionWithoutCount,
  parseInputs
};
