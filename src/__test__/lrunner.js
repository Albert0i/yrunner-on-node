const sqlite3 = require('sqlite3')
const { open } = require('sqlite')
const { lowerObjKey, lowerObjKeyArray } = require('../utils/lowerKeys')

let db = null; 

const openDb = async (filename='db.sqlite') => {
    try {
        db = await open({
            filename,
            driver: sqlite3.cached.Database
          })
        return db  
    } catch (err) {
        return err
    }
}

const runSelectSQL = async (cmdText, lowerKeys=false) => {
    try {
        const result = await db.all(cmdText)
        if (lowerKeys)
            {
                const newResult = lowerObjKeyArray(result)
                return { success: true, rows: newResult }    
            }
        else    
            return { success: true, rows: result }  
    } catch (err) {
        return { success: false, error: err }
    }
    
}

const runValueSQL = async (cmdText, lowerKeys=false) => {
    try {
        const result = await db.get(cmdText)
        if (lowerKeys && result)
        {
            const newResult = lowerObjKey(result)
            return { success: true, ...newResult }  
        }
        else 
            return { success: true, ...result }
        //return result
    } catch (err) {
        return { success: false, error: err }
    }
    
}

const runSQL = async (cmdText) => {
    try {
        const result = await db.run(cmdText)

        return { success: true, rowsAffected: result.changes }   
    } catch (err) {
        return { success: false, error: err }    

    }
}

module.exports = { runSQL, runValueSQL, runSelectSQL, openDb } 

/*
   SQLite Client for Node.js Apps
   https://github.com/kriasoft/node-sqlite#examples
*/