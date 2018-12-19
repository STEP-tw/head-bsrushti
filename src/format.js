const addHeading = function(fileName, content) {
  return makeHeader(fileName) + "\n" + content;
};

const makeHeader = function(heading) {
  return "==> " + heading + " <==";
};

module.exports = {
  addHeading,
  makeHeader
};
