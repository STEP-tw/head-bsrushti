const extractContents = function(contents, delimiter, initial, last) {
    return contents
      .split(delimiter)
      .slice(initial, last)
      .join(delimiter);
  };

  module.exports = {
      extractContents
  }