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

let illegalCount = 'head: illegal line count --';
const extractOption = function(details) { 
  if(details.some((option) => option.match(/-c/))) { return '-c'; };
  return '-n';
};

const extractLength = function(details) {
  extractFiles(details);
  let option = details.join('');
  if(option.match(/^-/) && !(option.match(/[0-9]/))){
    return illegalCount;
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

const printStructuredData = function(functionRef, files, contents, length) {
  if(isNaN(length)){ return console.log(length +" "+ files[0]); }
  let delimiter = '';
  for(file in files) {
    files.length > 1 && console.log(delimiter + makeHeader(files[file]));
    delimiter = '\n';
    console.log(functionRef(length, contents[file]));
  };
};

const getOptionFuncRef = function(option) {
  let funcRef;
  (option == '-c')? funcRef = extractNCharacters : funcRef = extractNLines;
  return funcRef;
}

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
  getOptionFuncRef
};

