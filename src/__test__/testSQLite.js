const { sq3db } = require('../config/sqliteConfig')

sq3db.all("SELECT * FROM tbrelcod", (error, rows) => {
    console.log(error)
    rows.forEach((row) => {
        console.log(row);
    })
});

/*
   Getting Started SQLite3 with Nodejs
   https://medium.com/@codesprintpro/getting-started-sqlite3-with-nodejs-8ef387ad31c4

   CREATE TABLE TBRELCOD ( RELCOD CHAR(2), RELDES CHAR(80), RELDESC CHAR(80), UPDATE_IDENT DECIMAL(7, 0), PRIMARY KEY(RELCOD) ); 
*/