const classifyDetails = function(details) { 
  if(!details) {return {};}
  return {
    option : details[0],
    length : +details[1],
    files : details.splice(2)
  };
};

module.exports = { classifyDetails }
