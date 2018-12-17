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

module.exports = {
  extractContents,
  extractLines
};
