const {
  head
} = require('./src/lib.js'); 

const fs = require('fs'); 

const main = function() { 
  let params = process.argv;
  console.log(head(params.slice(2),fs).join("\n")); 
};

main();
