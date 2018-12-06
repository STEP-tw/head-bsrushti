let illegalCount = 'head: illegal line count -- ';
let illegalByteCount = 'head: illegal byte count -- ';

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

const apply = function(readFileSync, files) { 
  return files.map((file) => readFileSync(file,'utf8'));
};

const makeHeader = function(heading) { 
  return "==> " + heading + " <==";
};

const extractOption = function(details) { 
  if(details.some((option) => option.match(/-c/))) { return '-c'; };
  return '-n';
};

const extractLength = function(details) {
  let files = extractFiles(details);
  let option = details.join('');
  if(isNaN(option.slice(2))) {
    return option.slice(2);
  };

  if(option.length == 2 && !Math.abs(option)) {
    return files[0];
  };
  let index = 0;
  while(!parseInt(option) && index < details.join('').length){
    option = details.join('');
    index++;
    option = option.slice(index);
  };
  return Math.abs(parseInt(option)) || 10;
};

const extractFiles = function(details) { 
  if(!(details[0].startsWith('-'))) {  
    return details.splice(0);
  };

  if(details[0].match(/^-/) && !(details[1].match(/^[0-9]/))) {
    return details.splice(1);
  };

  return details.splice(2);
};

const printStructuredData = function(functionRef, contents, details) {
  let {option, length, files} = classifyDetails(details);
  let fileData = [];
  let delimiter = '';
  if(!isCountAboveZero(length)) {
    fileData.push(getErrors(details, length))
    return fileData;
  };
  for(file in files) {
    files.length > 1 && fileData.push(delimiter + makeHeader(files[file]));
    delimiter = '\n';
    fileData.push(functionRef(length, contents[file]));
  };
  return fileData;
};

const getOptionFuncRef = function(option) {
  let funcRef;
  (option == '-c')? funcRef = extractNCharacters : funcRef = extractNLines;
  return funcRef;
};

const isCountAboveZero = function(count) {
  return !(count < 1 || isNaN(count));
};

const invalidCountError = function(type, count) {
  let typeName = 'line';
  if(type == '-c'){
    typeName = 'byte';
  }
  return 'head: illegal ' + typeName + ' count -- ' + count;
};

const getErrors = function(details, length) { 
  const type = extractOption(details);
  return invalidCountError(type, length);
};

module.exports = { 
  classifyDetails, 
  extractNLines,
  extractNCharacters,
  apply,
  makeHeader,
  extractOption,
  extractLength,
  extractFiles,
  printStructuredData,
  getErrors,
  getOptionFuncRef,
  isCountAboveZero,
  invalidCountError
};

