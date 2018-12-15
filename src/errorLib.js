const countErrorForHead = {
  "-n": "head: illegal line count -- ",
  "-c": "head: illegal byte count -- "
};

const countErrorForTail = {
  "-n": "tail: illegal offset -- ",
  "-c": "tail: illegal offset -- "
};

const invalidCountError = function(option, count, command) {
  const countError = {
    head: countErrorForHead,
    tail: countErrorForTail
  };
  return countError[command][option] + count;
};

const fileNotFoundError = function(file, command) {
  return command + ": " + file + ": No such file or directory";
};

const getInvalidCountError = function(option, count, command) {
  return invalidCountError(option, count, command);
};

module.exports = {
  invalidCountError,
  fileNotFoundError,
  getInvalidCountError
};
