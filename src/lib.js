const { parseInputs } = require("./parseInput.js");

const { fileNotFoundError, getInvalidCountError } = require("./errorLib.js");

const { getOptionFuncRef } = require('./util.js');

const getFilteredContent = function(
  fs,
  numberOfFiles,
  functionRef,
  range,
  command,
  file
) {
  if (!fs.existsSync(file)) {
    return fileNotFoundError(file, command);
  }

  if (fs.existsSync(file) && numberOfFiles > 1) {
    return format(fs.readFileSync, functionRef, command, file, range);
  }

  return functionRef(command, range, fs.readFileSync(file, "utf8"));
};

const format = function(reader, functionRef, command, file, range) {
  return makeHeader(file) + "\n" + functionRef(command, range, reader(file, "utf8"));
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

const isFileExists = function(existsSync, file) {
  return existsSync(file);
};

module.exports = {
  getFilteredContent,
  makeHeader,
  getFileData,
  isCountAboveZero,
  isFileExists,
  format
};
