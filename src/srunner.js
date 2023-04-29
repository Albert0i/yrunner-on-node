const Database = require('better-sqlite3')

let db = null; 

// Open database
const openDb = (filename='db.sqlite', options={verbose: defaultLogger}) => {
    try {
        db = new Database(filename, options)
        /*
        Though not required, it is generally important to set the WAL pragma for performance reasons.
        https://github.com/WiseLibs/better-sqlite3
        */
        db.pragma('journal_mode = WAL');
        
        return db
    } 
    catch (err) {
        console.log(err)
        return err
    }
}

// Run SQL Statement and return a data table
const runSelectSQL = (cmdText) => {
    try {
        const result = db.prepare(cmdText).all()

        return { success: true, rows: result } 
    } catch (err) {
        return { success: false, error: err }
    }
}

// Run SQL Statement and return a value
const runValueSQL = (cmdText) => {
    try {
        const result = db.prepare(cmdText).get()

        return { success: true, ...result }
    } catch (err) {
        return { success: false, error: err }
    }
}

// Run SQL Statements
const runSQL = (cmdText) => {
    try {
        const result = db.exec(cmdText)

        return { success: true, result }   
    } catch (err) {
        return { success: false, error: err }

    }
}

// Print out every SQL string executed by the database connection.
const defaultLogger = (cmdText) => {
    console.info(`> cmdText='${cmdText}'`)
}

module.exports = { openDb, runSelectSQL, runValueSQL, runSQL } 

/*
   better-sqlite3
   https://www.npmjs.com/package/better-sqlite3

   create table cache (
        tabname char(40),
        crtdate numeric(8, 0),
        crttime numeric(6,0),
        primary key (tabname)
   );
   insert into cache values('table1', 1, 2);
   insert into cache values('table2', 3, 4);
   insert into cache values('table3', 5, 6);
   insert into cache values('table4', 7, 8);
   insert into cache values('table5', 9, 10);
*/
