const { parseInputs } = require("./parseInput.js");

const { fileNotFoundError, getInvalidCountError } = require("./errorLib.js");

const { getOptionFuncRef } = require('./util.js');

const getFilteredContent = function(
  fs,
  fileLength,
  functionRef,
  count,
  command,
  file
) {
  if (!fs.existsSync(file)) {
    return fileNotFoundError(file, command);
  }

  if (fs.existsSync(file) && fileLength > 1) {
    return format(fs.readFileSync, functionRef, command, file, count);
  }

  return functionRef(command, count, fs.readFileSync(file, "utf8"));
};

const format = function(reader, functionRef, command, file, count) {
  return makeHeader(file) + "\n" + functionRef(command, count, reader(file, "utf8"));
};

const makeHeader = function(heading) {
  return "==> " + heading + " <==";
};

const getFileData = function(params, fs, command) {
  let { option, count, fileNames } = parseInputs(params);
  let functionRef = getOptionFuncRef(option);

  if (count == 0 && command == "tail") {
    return [];
  }

  if (!isCountAboveZero(count)) {
    return [getInvalidCountError(option, count, command)];
  }

  let getContent = getFilteredContent.bind(
    null,
    fs,
    fileNames.length,
    functionRef,
    count,
    command
  );
  return fileNames.map(getContent);
};

const isCountAboveZero = function(count) {
  return !(count < 1 || isNaN(count));
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
