const { parseInputs } = require("./parseInput.js");

const { fileNotFoundError, getInvalidCountError } = require("./errorLib.js");

const { addHeading } = require("./format");

const {
  isCountAboveZero,
  extractCharacters,
  extractLines
} = require("./util.js");

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
    return addHeading(fs.readFileSync, functionRef, command, fileName, range);
  }

  return functionRef(command, range, fs.readFileSync(fileName, "utf8"));
};

const getFunctionRef = function(option) {
  let funcRef = {
    "-c": extractCharacters,
    "-n": extractLines
  };
  return funcRef[option];
};

const getFileData = function(params, fs, command) {
  let { option, range, fileNames } = parseInputs(params);
  let functionRef = getFunctionRef(option);

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

const head = function(params, fs) {
  return getFileData(params, fs, "head").join("\n");
};

const tail = function(params, fs) {
  return getFileData(params, fs, "tail").join("\n");
};

module.exports = {
  getFilteredContent,
  addHeading,
  isCountAboveZero,
  addHeading,
  head,
  tail,
  getFunctionRef
};
