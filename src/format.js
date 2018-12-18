const addHeading = function(reader, functionRef, command, fileName, range) {
  return (
    makeHeader(fileName) +
    "\n" +
    functionRef(command, range, reader(fileName, "utf8"))
  );
};

const makeHeader = function(heading) {
  return "==> " + heading + " <==";
};

module.exports = {
  addHeading,
  makeHeader
};
