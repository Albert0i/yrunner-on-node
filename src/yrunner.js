const oracledb = require('oracledb');
const dbConfig = require('./config/dbConfig.js');

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

// Run SQL Statement and return a data table
const runSelectSQL = async (cmdText) => {
    let connection = null;
    try {
        connection = await oracledb.getConnection(dbConfig);    
        const result = await connection.execute(cmdText);
        return { success: true, rows: result.rows }
    } catch (err) {
        console.error(err);
        return { success: false, error: err, message: err.message, cmdText }
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
                return { success: false, error: err, message: err.message }
            }
        }
    }
}

// Run SQL Statement and return a value
const runValueSQL = async (cmdText) => {
    let connection = null;
    try {
        connection = await oracledb.getConnection(dbConfig);    
        const result = await connection.execute(cmdText);
        return { success: true, ...result.rows[0] }
    } catch (err) {
        console.error(err);
        return { success: false, error: err, message: err.message, cmdText }
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
                return { success: false, error: err, message: err.message }
            }
        }
    }
}

// Run SQL Statements
const runSQL = async (cmdTextArray) => {
    let connection = null;
    let cmdText = ''
    let result = null
    let rowsAffected = 0 
    try {
        connection = await oracledb.getConnection(dbConfig);

        for (i = 0; i < cmdTextArray.length; i++) 
        {
            cmdText = cmdTextArray[i]
            result = await connection.execute(cmdText);
            rowsAffected += result.rowsAffected
        }
        err = await connection.commit()        
        if (err) 
            return { success: false, error: err, message: err.message }    
        else 
            return { success: true, rowsAffected }        
    } catch (err) {
        console.error(err);
        return { success: false, error: err, message: err.message, cmdText }
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
                return { success: false, error: err, message: err.message }
            }
        }
    }
}

// Run SQL Insert Statement and return the auto increment row id
const RunInsertSQLYieldRowID = async (cmdText, rowid_name = "id") => {

}

module.exports = { runSQL, runValueSQL, runSelectSQL, RunInsertSQLYieldRowID } 

/*
   node-oracledb | SQL Execution
   https://node-oracledb.readthedocs.io/en/latest/user_guide/sql_execution.html#queryoutputformats
*/