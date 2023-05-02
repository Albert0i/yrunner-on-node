const yyyymmdd = () => {
    let today = new Date()
    return Number(today.getFullYear() + 
                  pad(today.getMonth()+1, 2) + 
                  pad(today.getDate(), 2))
}

const hhmmss = () => {
    let today = new Date()
    return Number(today.getHours() + 
                  pad(today.getMinutes(), 2) + 
                  pad(today.getSeconds(), 2))
}

function pad(num, size) {
    var s = "000000000" + num
    return s.substr(s.length-size)
}

console.log(yyyymmdd())
console.log(hhmmss())

/*
   How to Get Current Date & Time in JavaScript
   https://tecadmin.net/get-current-date-time-javascript/

   How to output numbers with leading zeros in JavaScript? [duplicate]
   https://stackoverflow.com/questions/2998784/how-to-output-numbers-with-leading-zeros-in-javascript
*/

// var today = new Date();
// var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();

// var today = new Date();
// var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

// console.log(date)
// console.log(time)