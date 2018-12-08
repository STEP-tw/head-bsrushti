const {
  classifyDetails, 
  getOptionFuncRef,
  printStructuredData
} = require('./src/lib.js'); 

const fs = require('fs'); 

const main = function() { 
  let details = process.argv;
  let option = classifyDetails(details.slice(2)).option
  console.log(printStructuredData(getOptionFuncRef(option),details.slice(2),fs).join("\n")); 
};

main();
