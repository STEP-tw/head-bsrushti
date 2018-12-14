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

const parseInputs = function(params) {
    const defaultOptions = { option: "-n", count: 10, fileNames: params };

    if(isNumberOption(params[0])) {
        return { 
        option: "-n",
        count: params[0].slice(1),
        fileNames: params.slice(1)
        };
    };

    if(isOptionWithoutCount(params[0])) {
        return {
            option: params[0].slice(0, 2),
            count: params[1],
            fileNames: params.slice(2)
        };
    }

    if(isOptionWithCount(params[0])) {
        return {
            option: params[0].slice(0, 2),
            count: params[0].substr(2),
            fileNames: params.slice(1)
        };
    };

    return defaultOptions;
};

module.exports = { 
    isDetailsStartsWithHyphen,
    isNumberOption,
    isOptionWithCount,
    isOptionWithoutCount,
    parseInputs
 };