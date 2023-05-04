const { runSQL, runSelectSQL, openDb } = require('./srunner')
const { yyyymmdd, hhmmss } = require('./utils/datetime')

let cachedItems = []

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

const startCache = (filename='db.sqlite', options) => {
    const db = openDb(filename, options)
    let result = null
    let itemResult = null
    let itemRemoved = false
    console.log(db)

    result = runSelectSQL("SELECT * FROM __cache__", true)
    if (result.success) {
        cachedItems = result.rows
        
        // Sanity check... 
        for (i=0; i< cachedItems.length; i++)
        {
            itemResult = runSQL([`SELECT 1 FROM ${cachedItems[i].tabname} LIMIT 1`])
            if (itemResult.success) 
                console.log(`${cachedItems[i].tabname} is ok`)
            else {                
                // if no such table, remove it from __cache__
                itemResult = runSQL([`DELETE FROM __cache__ WHERE tabname='${cachedItems[i].tabname}'`])                
                if (! itemResult.success)
                    console.log(itemResult)
                    itemRemoved = true;
            }            
        }
        // Reload cached items... 
        if (itemRemoved) 
        {
            result = runSelectSQL("SELECT * FROM __cache__", true)
            if (result.success)
                cachedItems = result.rows
        }
    }    
    else {
        console.log(result)
        // Try to re-create __cache__ table... 
        const newResult = runSQL(["CREATE TABLE __cache__ ( tabname CHAR(40), crtdate NUMERIC(8, 0), crttime NUMERIC(6,0), CONSTRAINT __cache__pk PRIMARY KEY (tabname) );"])
        console.log(newResult)
    }

    console.log(`Number of cached item${cachedItems.length>1?'s':''} ${cachedItems.length>1?'are':'is'} ${cachedItems.length}.`)
}

module.exports = { startCache, getCachedItems, isCached, addItem, removeItem } 
