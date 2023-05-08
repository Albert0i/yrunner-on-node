const { runSQL, runSelectSQL, openDb } = require('./srunner')
const { yyyymmdd, hhmmss } = require('./utils/datetime')

let dbName = null;
let dbOptions = null; 
let db = null
let cachedItems = []

const loadCachedItems = () => {
    const result = runSelectSQL("SELECT * FROM __cache__", true)
    if (result.success) 
        cachedItems = result.rows
    else 
        console.log(result)

    return result.success
}

const createCacheTable = () => {
    const result = runSQL(["CREATE TABLE __cache__ ( tabname CHAR(40), crtdate NUMERIC(8, 0), crttime NUMERIC(6,0), CONSTRAINT __cache__pk PRIMARY KEY (tabname) );"])
    if (result.success) 
        console.log('cache table created.')
    else 
        console.log(result)

    return result.success
}

const sanityCheck = () => {
    let result = null
    let itemsDeleted = 0

    for (i=0; i< cachedItems.length; i++)
    {
        result = runSQL([`SELECT 1 FROM ${cachedItems[i].tabname} LIMIT 1`])
        if (result.success) 
            console.log(`${cachedItems[i].tabname} is OK`)
        else {                
            // if no such table, remove it from cache table
            result = runSQL([`DELETE FROM __cache__ WHERE tabname='${cachedItems[i].tabname}'`])                
            if (! result.success) 
                console.log(result)
            itemsDeleted += 1
        } 
    }
}

const startCache = (filename='db.sqlite', options) => {
    dbName = filename
    dbOptions = options 

    db = openDb(filename, options)
    console.log(db)
    
    if (loadCachedItems()) {
        // Do sanity check and reload if necessary... 
        if (sanityCheck() !== 0)
            loadCachedItems()
    }
    else {
        // Re-create __cache__
        createCacheTable()
    }

    console.log(`Number of cached item${cachedItems.length>1?'s':''} ${cachedItems.length>1?'are':'is'} ${cachedItems.length}.`)
}

// const startCache = (filename='db.sqlite', options) => {
//     const db = openDb(filename, options)
//     let result = null
//     let itemResult = null
//     let itemRemoved = false
//     console.log(db)

//     result = runSelectSQL("SELECT * FROM __cache__", true)
//     if (result.success) {
//         cachedItems = result.rows
        
//         // Sanity check... 
//         for (i=0; i< cachedItems.length; i++)
//         {
//             itemResult = runSQL([`SELECT 1 FROM ${cachedItems[i].tabname} LIMIT 1`])
//             if (itemResult.success) 
//                 console.log(`${cachedItems[i].tabname} is OK`)
//             else {                
//                 // if no such table, remove it from __cache__
//                 itemResult = runSQL([`DELETE FROM __cache__ WHERE tabname='${cachedItems[i].tabname}'`])                
//                 if (! itemResult.success)
//                     console.log(itemResult)
//                     itemRemoved = true;
//             }            
//         }
//         // Reload cached items... 
//         if (itemRemoved) 
//         {
//             result = runSelectSQL("SELECT * FROM __cache__", true)
//             if (result.success)
//                 cachedItems = result.rows
//         }
//     }    
//     else {
//         console.log(result)
//         // Try to re-create __cache__ table... 
//         const newResult = runSQL(["CREATE TABLE __cache__ ( tabname CHAR(40), crtdate NUMERIC(8, 0), crttime NUMERIC(6,0), CONSTRAINT __cache__pk PRIMARY KEY (tabname) );"])
//         console.log(newResult)
//     }

//     console.log(`Number of cached item${cachedItems.length>1?'s':''} ${cachedItems.length>1?'are':'is'} ${cachedItems.length}.`)
// }

const getCachedItems = () => {
    return cachedItems
}

const isCached = (name) => {    
    const lcName = name.toLowerCase()

    return cachedItems.find(row => row.tabname.toLowerCase() === lcName) !== undefined;
}

const addItem = (name, schema, data, singleStep=false) => {    
    if (! isCached(name)) 
    { 
        const crtdate = yyyymmdd()
        const crttime = hhmmss()
        let result = null
        // Add entry to cache
        if (singleStep) {
            result = runSQL([`INSERT INTO __cache__ VALUES('${name}', ${crtdate}, ${crttime}); `, 
                              schema, 
                              ...data.split(';') ], singleStep)
        } else {
            result = runSQL([`INSERT INTO __cache__ VALUES('${name}', ${crtdate}, ${crttime}); ` + 
                              schema + data ], singleStep)
        }

        // Add entry memory
        if (result.success)
            cachedItems.push({ tabname: name, crtdate, crttime})
        else 
            console.log(result)
        return result
    } else {
        return {
            "success": false,
            "message": `${name} already loaded`
        }
    }
}

const removeItem = (name) => {
    if (isCached(name)) 
    {   
        // Remove entry from memory!!!
        cachedItems = cachedItems.filter(row => row.tabname !== name)

            // Remove entry from cache 
            const result = runSQL([`DELETE FROM __cache__ WHERE tabname='${name}'`,
                                   `DROP TABLE ${name}`])
            if (! result.success)
                console.log(result)                
            return result 
    } else 
        return {
            "success": false,
            "message": `${name} not yet loaded`
                }
}

module.exports = { startCache, getCachedItems, isCached, addItem, removeItem } 
