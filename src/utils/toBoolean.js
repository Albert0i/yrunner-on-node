const toBoolean = (dataStr) => {
    return !!(dataStr?.toLowerCase?.() === 'true' || dataStr === true);
  };

module.exports = { toBoolean } 
  
/*
   Proper way to parse environment variables
   https://stackoverflow.com/questions/59599304/proper-way-to-parse-environment-variables
*/