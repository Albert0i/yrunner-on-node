const sqlite3 = require('sqlite3');
const sq3db = new sqlite3.Database('../data/db.sqlite');

module.exports = {
    sq3db
};

/*
   Getting Started SQLite3 with Nodejs
   https://medium.com/@codesprintpro/getting-started-sqlite3-with-nodejs-8ef387ad31c4
*/