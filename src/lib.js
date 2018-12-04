const classifyDetails = function(details) { 
  if(!details) {return {};};
  return {
    option : details[0],
    length : +details[1],
    files : details.splice(2)
  };
};

const extractNLines = function(length, contents) { 
  return contents.split("\n").splice(0,length).join("\n");
};

module.exports = { 
  classifyDetails, 
  extractNLines
};
