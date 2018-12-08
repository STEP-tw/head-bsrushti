const {
  classifyDetails, 
  getOptionFuncRef,
  head
} = require('./src/lib.js'); 

const fs = require('fs'); 

const main = function() { 
  let details = process.argv;
  let option = classifyDetails(details.slice(2)).option;
  console.log(head(getOptionFuncRef(option),details.slice(2),fs).join("\n")); 
};

main();
