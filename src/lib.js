const classifyDetails = function(details) { 
  if(!details) {return {};};
  return {
    option : extractOption(details), 
    length : extractLength(details.slice(0,2)),
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

const extractOption = function(details) { 
  if(details.some((option) => option.match(/-c/))) { return '-c'; };
  return '-n';
};

const mapper = function(detail) { 
  let length = option.match(/[0-9]/);
  if(length) { return length[0]; }
};

const checkHyphen = function(option) { 
  if(option.startsWith('-')) {
    return option;
  };
};

const extractLength = function(details) {
  let option = checkHyphen(details[0]);
  let lengths = option.match(/[0-9]/);
  if(lengths) { return +lengths[0]};
  lengths = details[1].match(/[0-9]/);
  if(lengths) { return +lengths[0]; }
  return 10;
};

module.exports = { 
  classifyDetails, 
  extractNLines,
  extractNCharacters,
  readFile,
  makeHeader,
  extractOption,
  extractLength,
  checkHyphen
};
