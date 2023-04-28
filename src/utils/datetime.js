
const yyyymmdd = () => {
    return replaceAll(new Date().toISOString().split('T')[0], '-', '')
}

const hhmmss = () => {
    return replaceAll(new Date().toISOString().split('T')[1].split('.')[0], ':', '')
}
function replaceAll(string, search, replace) {
    return string.split(search).join(replace);
}

module.exports = { yyyymmdd, hhmmss } 

/*
   Format JavaScript date as yyyy-mm-dd
   https://stackoverflow.com/questions/23593052/format-javascript-date-as-yyyy-mm-dd

   3 Ways To Replace All String Occurrences in JavaScript
   https://dmitripavlutin.com/replace-all-string-occurrences-javascript/
*/
