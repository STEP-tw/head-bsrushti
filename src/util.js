const extractContents = function(contents, delimiter, initial, last) {
  return contents
    .split(delimiter)
    .slice(initial, last)
    .join(delimiter);
};

const extractLines = function(command, count, contents) {
  let linesAsCommand = {
    head: extractContents(contents, "\n", 0, count),
    tail: extractContents(contents, "\n", -count, contents.split("\n").length)
  };
  return linesAsCommand[command];
};

const extractCharacters = function(command, count, contents) {
  let charactersAsCommand = {
    head: extractContents(contents, "", 0, count),
    tail: extractContents(contents, "", -count, contents.split("").length)
  };
  return charactersAsCommand[command];
};

const getFunctionRef = function(option) {
  let funcRef = {
    "-c": extractCharacters,
    "-n": extractLines
  };
  return funcRef[option];
};

const isCountAboveZero = function(range) {
  return !(range < 1 || isNaN(range));
};

module.exports = {
  extractContents,
  extractLines,
  extractCharacters,
  getFunctionRef,
  isCountAboveZero
};
