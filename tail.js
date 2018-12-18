const { tail } = require("./src/lib.js");
const fs = require("fs");

const main = function() {
  let params = process.argv;
  console.log(tail(params.slice(2), fs));
};

main();
