const {fileNotFoundError} = require('../src/errorLib');

const contentWithHeading = function(fileAttributes, command) {
  if(fileAttributes.existStatus == false) {
    return fileNotFoundError(fileAttributes.fileName, command);
  }
  return makeHeader(fileAttributes.fileName) + "\n" + fileAttributes.content;
};

const makeHeader = function(heading) {
  return "==> " + heading + " <==";
};

const contentWithoutHeading = function(fileAttributes, command) {
  if(fileAttributes.existStatus == false) {
    return fileNotFoundError(fileAttributes.fileName, command);
  };
  return fileAttributes.content;
};

const format = function(listLength, command, fileAttributes) {
  if(listLength > 1) {
    return contentWithHeading(fileAttributes, command);
  };
  return contentWithoutHeading(fileAttributes, command);
}

module.exports = {
  contentWithHeading,
  makeHeader,
  format
};
