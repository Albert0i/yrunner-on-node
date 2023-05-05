const info = () => {
    return { 
             arch: `Process Architecture: ${process.arch}`,
             pid: `Process PID: ${process.pid}`, 
             platform: `Process Platform: ${process.platform}`, 
             version: `Process Version: ${process.version}` 
           }             
}

module.exports = { info } 

/*
   Node.js Process
   https://www.javatpoint.com/nodejs-process
*/