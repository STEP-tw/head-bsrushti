const { parseInputs } = require("./parseInput.js");

const { getInvalidCountError } = require("./errorLib.js");

const { format } = require("./format");

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
    return {fileName : fileName, content: "", existStatus: false};
  }

  if (numberOfFiles > 1) {
    return {
      fileName : fileName,
      content : functionRef(command, count, readFile(fs.readFileSync, fileName)),
      existStatus : true
    }
  }
  return {
    fileName : fileName,
    content : functionRef(command, count, readFile(fs.readFileSync, fileName)),
    existStatus : true
  }
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

  let fileList = (fileNames.map(
    getFilteredContent.bind(
      null,
      fs,
      fileNames.length,
      functionRef,
      count,
      command
    ))
  );
  return (fileList.map(format.bind(null, fileList.length, command)));
};

const head = function(params, fs) {
  return getFileData(params, fs, "head").join("\n");
};

const tail = function(params, fs) {
  return getFileData(params, fs, "tail").join("\n");
};

module.exports = {
  getFilteredContent,
  isCountAboveZero,
  head,
  tail,
  getFunctionRef
};
