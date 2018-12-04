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

const extractNCharacters = function(length, contents) { 
  return contents.split("").splice(0,length).join("");
};

const readFile = function(readFileSync, files) { 
  return files.map((file) => readFileSync(file,'utf8'));
};

const makeHeader = function(heading) { 
  return "==> " + heading + " <==";
};

module.exports = { 
  classifyDetails, 
  extractNLines,
  extractNCharacters,
  readFile,
  makeHeader
};
