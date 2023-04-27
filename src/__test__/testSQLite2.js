const sqlite3 = require('sqlite3')
const { open } = require('sqlite')
const { lowerObjKey, lowerObjKeyArray } = require('../utils/lowerKeys')

let db = null; 

const startCache = async () => {
    db = await openDb()
}

const openDb = async () => {
  return open({
    filename: '../data/db.sqlite',
    driver: sqlite3.cached.Database
  })
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
        if (lowerKeys)
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

const testing = async () => {
    await startCache()
    const result1 = await runSelectSQL("select * from tbrelcodbb", true)
    console.log(result1)
    const result2 = await runValueSQL("select * from tbrelcod where relcod='KK'", true)
    console.log(result2)
    const result3 = await runSQL("update tbrelcod set update_ident=update_ident+1 where relcod='KK'")
    console.log(result3)
}

testing()
/*
   SQLite Client for Node.js Apps
   https://github.com/kriasoft/node-sqlite#examples
*/