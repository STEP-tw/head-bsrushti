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
  let length = detail.match(/[0-9]/);
  if(length) { return length[0]; }
};

const extractLength = function(details) {
  let lengths = details.map(mapper);
  lengths = lengths.filter((x) => x != undefined)
  if(lengths.length) { return +lengths[0]};
  return 10;
};

module.exports = { 
  classifyDetails, 
  extractNLines,
  extractNCharacters,
  readFile,
  makeHeader,
  extractOption,
  extractLength
};
