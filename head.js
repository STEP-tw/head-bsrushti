const {
  classifyDetails, 
  getOptionFuncRef,
  printStructuredData
} = require('./src/lib.js'); 

const fs = require('fs'); 

const main = function() { 
  let details = process.argv;
  let option = classifyDetails(details.slice(2)).option
  console.log(printStructuredData(getOptionFuncRef(option),details.slice(2),fs).join("\n")
  ); 
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
