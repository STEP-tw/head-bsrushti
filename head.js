const {
  classifyDetails, 
  extractNLines,
  extractNCharacters,
  readFile,
  makeHeader,
  printStructuredData
} = require('./src/lib.js'); 

const { readFileSync } = require('fs'); 

const main = function() { 
  let details = process.argv;
  let {option, length, files} = classifyDetails(details.slice(2));
  let contents = readFile(readFileSync, files);

  if(option == '-n') {
    printStructuredData(extractNLines, files, contents, length);
  };

  if(option == '-c') {
    printStructuredData(extractNCharacters, files, contents, length);
  };

};

main();

/* 
  Usage:
  node ./head.js file1
  node ./head.js -n5 file1
  node ./head.js -n 5 file1
  node ./head.js -5 file1
  node ./head.js file1 file2
  node ./head.js -n 5 file1 file2
  node ./head.js -n5 file1 file2
  node ./head.js -5 file1 file2 
  node ./head.js -c5 file1
  node ./head.js -c 5 file1
  node ./head.js -c5 file1 file2
  node ./head.js -c 5 file1 file2
*/
