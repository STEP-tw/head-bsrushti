const { parseInputs } = require("./parseInput.js");

const { fileNotFoundError, getInvalidCountError } = require("./errorLib.js");

const { addHeading } = require("./format");

const {
  isCountAboveZero,
  extractCharacters,
  extractLines
} = require("./util.js");

const readFile = function(reader, fileName) {
  return reader(fileName, "utf8");
};

const getFilteredContent = function(
  fs,
  numberOfFiles,
  functionRef,
  count,
  command,
  fileName
) {
  if (!fs.existsSync(fileName)) {
    return fileNotFoundError(fileName, command);
  }

  if (numberOfFiles > 1) {
    return addHeading(
      fileName,
      functionRef(command, count, readFile(fs.readFileSync, fileName))
    );
  }

  return functionRef(command, count, readFile(fs.readFileSync, fileName));
};

const getFunctionRef = function(option) {
  return {
    "-c": extractCharacters,
    "-n": extractLines
  }[option];
};

const getFileData = function(params, fs, command) {
  let { option, count, fileNames } = parseInputs(params);
  let functionRef = getFunctionRef(option);
  if (count == 0 && command == "tail") {
    return [];
  }

  if (!isCountAboveZero(count)) {
    return [getInvalidCountError(option, count, command)];
  }

  return fileNames.map(
    getFilteredContent.bind(
      null,
      fs,
      fileNames.length,
      functionRef,
      count,
      command
    )
  );
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
