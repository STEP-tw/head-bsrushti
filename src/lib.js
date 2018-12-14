const { 
  isDetailsStartsWithHyphen,
  parseInputs
 } = require('./parseInput.js');

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
  return extractContents(contents, "\n", -count, contents.split("\n").length);
};

const extractTailCharacters = function(count, contents) {
  return extractContents(contents, "", -count, contents.split("").length);
};

const getFilteredContent = function(fs, file, fileLength, functionRef, count, command) {
  if (!fs.existsSync(file)) {
    return fileNotFoundError(file, command);
  };

  if (fs.existsSync(file) && fileLength > 1) {
    return format(fs.readFileSync, functionRef, file, count);
  };

  return functionRef(count, fs.readFileSync(file, "utf8"));
};

const format = function(reader, functionRef, file, count) {
  return makeHeader(file) + "\n" + functionRef(count, reader(file,"utf8")); 
};

const makeHeader = function(heading) {
  return "==> " + heading + " <==";
};

const isValidCount = function(option) {
  return !(option.length == 2 && !Math.abs(option));
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

const getFileData = function(params, fs, command) {
  let { option, count, fileNames } = parseInputs(params); 
  let functionRef = getFuncRef(command, option);
  let fileData = [];
  if (count==0 && command == 'tail') {return [];}
  if (!isCountAboveZero(count)) {
    fileData.push(invalidCountError(option, count, command));
    return fileData;
  };

  for (file in fileNames) {
    let getContent = getFilteredContent.bind(null, fs, fileNames[file]);
    let content = getContent(fileNames.length, functionRef, count, command);
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

const invalidCountError = function(type, count, command) {
  if(command == 'head') {
    let typeName = "line";
    if (type == "-c") {
      typeName = "byte";
    };
    return "head: illegal " + typeName + " count -- " + count;
  };
  return "tail: illegal offset -- " + count;
};

const fileNotFoundError = function(file, command) {
  return command+": " + file + ": No such file or directory";
};

const isFileExists = function(existsSync, file) {
  return existsSync(file);
};

const getFuncRef = function(param, option) {
  if(param.match(/head.*/)) {
    return getOptionFuncRefForHead(option);
  };
  return getOptionFuncRefForTail(option);
};

module.exports = {
  extractHeadLines,
  extractHeadCharacters,
  getFilteredContent,
  makeHeader,
  getFileData,
  getOptionFuncRefForHead,
  isCountAboveZero,
  invalidCountError,
  fileNotFoundError,
  isFileExists,
  isValidCount,
  extractContents,
  getCountFromOption,
  isDetailsStartsWithHyphen,
  extractTailLines,
  extractTailCharacters,
  getOptionFuncRefForTail,
  getFuncRef,
  format
};
