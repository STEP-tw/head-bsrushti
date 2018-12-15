const { getFileData } = require("./src/lib.js");
const fs = require("fs");

const main = function() {
  let params = process.argv;
  console.log(getFileData(params.slice(2), fs, "head").join("\n"));
};

main();
