const { 
  parseInputs
 } = require('./parseInput.js');

 const {
   fileNotFoundError,
   getInvalidCountError
 } = require('./errorLib.js');

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

const getFilteredContent = function(fs, fileLength, functionRef, count, command, file) {
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

const getFileData = function(params, fs, command) {
  let { option, count, fileNames } = parseInputs(params);
  let functionRef = getFuncRef(command, option);
  
  if (count == 0 && command == 'tail') {return [];}
  
  if (!isCountAboveZero(count)) {
    return [getInvalidCountError(option, count, command)];
  };

  let getContent = getFilteredContent.bind(null, fs, fileNames.length, functionRef, count, command);
  return fileNames.map(getContent);
};

const getOptionFuncRefForHead = function(option) {
  let funcRef = {
    '-c' : extractHeadCharacters,
    '-n' : extractHeadLines
  };
  return funcRef[option];
};

const getOptionFuncRefForTail = function(option) {
  let funcRef = { 
    '-c' : extractTailCharacters,
    '-n' : extractTailLines
  };
  return funcRef[option];
};

const isCountAboveZero = function(count) {
  return !(count < 1 || isNaN(count));
};

const isFileExists = function(existsSync, file) {
  return existsSync(file);
};

const getFuncRef = function(command, option) {
  let functionRefs = {
    head : getOptionFuncRefForHead(option), 
    tail : getOptionFuncRefForTail(option)
  };
  return functionRefs[command];
};

module.exports = {
  extractHeadLines,
  extractHeadCharacters,
  getFilteredContent,
  makeHeader,
  getFileData,
  getOptionFuncRefForHead,
  isCountAboveZero,
  isFileExists,
  extractContents,
  extractTailLines,
  extractTailCharacters,
  getOptionFuncRefForTail,
  getFuncRef,
  format
};
