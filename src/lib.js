const classifyDetails = function(details) { 
  if(!details) {return {};};
  return {
    option : extractOption(details), 
    length : extractLength(details.slice(0,2)),
    files : extractFiles(details)
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

const extractLength = function(details) {
  extractFiles(details);
  let list = details.join('');
  let index = 0;
  while(!parseInt(list) && index < details.join('').length){
    list = details.join('');
    index++;
    list = list.slice(index);
  };
  return Math.abs(parseInt(list)) || 10;
};

const extractFiles = function(details) { 
  if(!(details[0].startsWith('-'))) {  
    return details.splice(0);
  };

  if(details[0].match(/^-/) && !(details[1].match(/^[0-9]/))) {
    return details.splice(1);
  };

  if(details[1].match(/^[0-9]/)) {
    return details.splice(2);
  };
};

const printStructuredData = function(functionRef, files, contents, length) {
  for(file in files) {
    files.length > 1 && console.log(makeHeader(files[file]));
    console.log(functionRef(length, contents[file]));
  };
};

const getResult = function(files, option, contents, length) {
  if(option == '-c') {
    printStructuredData(extractNCharacters, files, contents, length);
  };
  printStructuredData(extractNLines, files, contents, length);
};

module.exports = { 
  classifyDetails, 
  extractNLines,
  extractNCharacters,
  readFile,
  makeHeader,
  extractOption,
  extractLength,
  extractFiles,
  printStructuredData,
  getResult
};

