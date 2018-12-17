const { parseInputs } = require("./parseInput.js");

const { fileNotFoundError, getInvalidCountError } = require("./errorLib.js");

const { getOptionFuncRef } = require('./util.js');

const getFilteredContent = function(
  fs,
  numberOfFiles,
  functionRef,
  range,
  command,
  fileName
) {
  if (!fs.existsSync(fileName)) {
    return fileNotFoundError(fileName, command);
  }

  if (fs.existsSync(fileName) && numberOfFiles > 1) {
    return format(fs.readFileSync, functionRef, command, fileName, range);
  }

  return functionRef(command, range, fs.readFileSync(fileName, "utf8"));
};

const format = function(reader, functionRef, command, fileName, range) {
  return makeHeader(fileName) + "\n" + functionRef(command, range, reader(fileName, "utf8"));
};

const makeHeader = function(heading) {
  return "==> " + heading + " <==";
};

const getFileData = function(params, fs, command) {
  let { option, range, fileNames } = parseInputs(params);
  let functionRef = getOptionFuncRef(option);

  if (range == 0 && command == "tail") {
    return [];
  }

  if (!isCountAboveZero(range)) {
    return [getInvalidCountError(option, range, command)];
  }

  let getContent = getFilteredContent.bind(
    null,
    fs,
    fileNames.length,
    functionRef,
    range,
    command
  );
  return fileNames.map(getContent);
};

const isCountAboveZero = function(range) {
  return !(range < 1 || isNaN(range));
};

const isFileExists = function(existsSync, fileName) {
  return existsSync(fileName);
};

module.exports = {
  getFilteredContent,
  makeHeader,
  getFileData,
  isCountAboveZero,
  isFileExists,
  format
};
