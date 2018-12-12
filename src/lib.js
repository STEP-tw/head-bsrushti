const classifyDetails = function(params) {
  params = params.slice(0);
  return {
    option: extractOption(params[1]),
    count: extractCount(params.slice(1, 3)),
    files: extractFiles(params.slice(1))
  };
};

const extractContents = function(contents, delimiter, initial, last) { 
  return contents.split(delimiter).splice(initial, last).join(delimiter);
};

const extractHeadLines = function(count, contents) {
  return extractContents(contents, "\n", 0, count);
};

const extractHeadCharacters = function(count, contents) {
  return extractContents(contents, "", 0, count);
};

const extractTailLines = function(count, contents) {
  return extractContents(contents, "\n", 0-count, contents.length);
};

const extractTailCharacters = function(count, contents) {
  return extractContents(contents, "", 0-count, contents.length);
};

const apply = function(fs, file, fileLength, functionRef, count) {
  if (!fs.existsSync(file)) {
    return fileNotFoundError(file);
  };

  if (fs.existsSync(file) && fileLength > 1) {
    return ( makeHeader(file) + "\n" + functionRef(count, fs.readFileSync(file, "utf8")));
  };

  return functionRef(count, fs.readFileSync(file, "utf8"));
};

const makeHeader = function(heading) {
  return "==> " + heading + " <==";
};

const extractOption = function(param) {
  if (param.match(/-c/)) {
    return "-c";
  };
  return "-n";
};

const isValidCount = function(option) {
  return !(option.length == 2 && !Math.abs(option));
};

const isIncludesZero = function(option) {
  return option.includes(0);
};

const extractCount = function(params) {
  let files = extractFiles(params);
  let option = params.join("");
  if (isNaN(option.slice(2)) || isIncludesZero(option.slice(2))) {
    return option.slice(2);
  };

  if (!isValidCount(option)) {
    return files[0];
  };

  return getCountFromOption(option, params);
};

const getCountFromOption = function(option, params) { 
  let index = 0;
  while (!parseInt(option) && index < params.join("").length) {
    option = params.join("");
    index++;
    option = option.slice(index);
  };
  return Math.abs(parseInt(option)) || 10;
};

const isDetailsStartsWithHyphen = function(params) { 
  return params[0].startsWith('-');
};

const extractFiles = function(params) {
  if (!isDetailsStartsWithHyphen(params)) {
    return params.splice(0);
  };

  if (isDetailsStartsWithHyphen(params) && !params[1].match(/^[0-9]/)) {
    return params.splice(1);
  };

  return params.splice(2);
};

const head = function(params, fs) {
  let { option, count, files } = classifyDetails(params);
  let functionRef = getOptionFuncRefForHead(option);
  let fileData = [];
  if (!isCountAboveZero(count)) {
    fileData.push(invalidCountError(option, count));
    return fileData;
  };

  for (file in files) {
    let getContent = apply.bind(null, fs, files[file]);
    let content = getContent(files.length, functionRef, count);
    fileData.push(content);
  };
  return fileData;
};

const getOptionFuncRefForHead = function(option) {
  let funcRef;
  option == "-c" ? (funcRef = extractHeadCharacters) : (funcRef = extractHeadLines);
  return funcRef;
};

const getOptionFuncRefForTail = function(option) {
  let funcRef;
  option == "-c" ? (funcRef = extractTailCharacters) : (funcRef = extractTailLines);
  return funcRef;
};

const isCountAboveZero = function(count) {
  return !(count < 1 || isNaN(count));
};

const invalidCountError = function(type, count) {
  let typeName = "line";
  if (type == "-c") {
    typeName = "byte";
  };
  return "head: illegal " + typeName + " count -- " + count;
};

const fileNotFoundError = function(file) {
  return "head: " + file + ": No such file or directory";
};

const isFileExists = function(existsSync, file) {
  return existsSync(file);
};


module.exports = {
  classifyDetails,
  extractHeadLines,
  extractHeadCharacters,
  apply,
  makeHeader,
  extractOption,
  extractCount,
  extractFiles,
  head,
  getOptionFuncRefForHead,
  isCountAboveZero,
  invalidCountError,
  fileNotFoundError,
  isFileExists,
  isValidCount,
  isIncludesZero,
  extractContents,
  getCountFromOption,
  isDetailsStartsWithHyphen,
  extractTailLines,
  extractTailCharacters,
  getOptionFuncRefForTail
};
