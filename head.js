const {
  classifyDetails, 
  getOptionFuncRef,
  head
} = require('./src/lib.js'); 

const fs = require('fs'); 

const main = function() { 
  let params = process.argv;
  let option = classifyDetails(params.slice(2)).option;
  console.log(head(params.slice(2),fs).join("\n")); 
};

main();
