let illegalCount = "head: illegal line count -- ";
let illegalByteCount = "head: illegal byte count -- ";

const classifyDetails = function(details) {
  return {
    option: extractOption(details),
    length: extractCount(details.slice(0, 2)),
    files: extractFiles(details)
  };
};

const extractLines = function(length, contents) {
  return contents
    .split("\n")
    .splice(0, length)
    .join("\n");
};

const extractCharacters = function(length, contents) {
  return contents
    .split("")
    .splice(0, length)
    .join("");
};

const apply = function(fs, file, fileLength, functionRef, length) {
  if (!fs.existsSync(file)) {
    return fileNotFoundError(file);
  }
  if (fs.existsSync(file) && fileLength > 1) {
    return (
      makeHeader(file) +
      "\n" +
      functionRef(length, fs.readFileSync(file, "utf8"))
    );
  }
  return functionRef(length, fs.readFileSync(file, "utf8"));
};

const makeHeader = function(heading) {
  return "==> " + heading + " <==";
};

const extractOption = function(details) {
  if (details[0].match(/-c/)) {
    return "-c";
  }
  return "-n";
};

const isValidLength = function(option) {
  return !(option.length == 2 && !Math.abs(option));
};

const isIncludesZero = function(option) {
  return option.includes(0);
};

const extractCount = function(details) {
  let files = extractFiles(details);
  let option = details.join("");
  if (isNaN(option.slice(2)) || isIncludesZero(option.slice(2))) {
    return option.slice(2);
  }

  if (!isValidLength(option)) {
    return files[0];
  }

  let index = 0;
  while (!parseInt(option) && index < details.join("").length) {
    option = details.join("");
    index++;
    option = option.slice(index);
  }
  return Math.abs(parseInt(option)) || 10;
};

const extractFiles = function(details) {
  if (!details[0].startsWith("-")) {
    return details.splice(0);
  }

  if (details[0].match(/^-/) && !details[1].match(/^[0-9]/)) {
    return details.splice(1);
  }

  return details.splice(2);
};

const printStructuredData = function(functionRef, details, fs) {
  let { option, length, files } = classifyDetails(details);
  let fileData = [];
  if (!isCountAboveZero(length)) {
    fileData.push(getErrors(details, length));
    return fileData;
  }

  for (file in files) {
    let getContent = apply.bind(null, fs, files[file]);
    let content = getContent(files.length, functionRef, length);
    fileData.push(content);
  }
  return fileData;
};

const getOptionFuncRef = function(option) {
  let funcRef;
  option == "-c" ? (funcRef = extractCharacters) : (funcRef = extractLines);
  return funcRef;
};

const isCountAboveZero = function(count) {
  return !(count < 1 || isNaN(count));
};

const invalidCountError = function(type, count) {
  let typeName = "line";
  if (type == "-c") {
    typeName = "byte";
  }
  return "head: illegal " + typeName + " count -- " + count;
};

const getErrors = function(details, length) {
  const type = extractOption(details);
  return invalidCountError(type, length);
};

const fileNotFoundError = function(file) {
  return "head: " + file + ": No such file or directory";
};

const isFileExists = function(existsSync, file) {
  return existsSync(file);
};

module.exports = {
  classifyDetails,
  extractLines,
  extractCharacters,
  apply,
  makeHeader,
  extractOption,
  extractCount,
  extractFiles,
  printStructuredData,
  getErrors,
  getOptionFuncRef,
  isCountAboveZero,
  invalidCountError,
  fileNotFoundError,
  isFileExists,
  isValidLength,
  isIncludesZero
};
