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

const addItem = (name, schema, data) => {
    if (! isCached(name)) 
    { 
        const crtdate = yyyymmdd()
        const crttime = hhmmss()
        // Add entry to cache
        const result = runSQL([`INSERT INTO __cache__ VALUES('${name}', ${crtdate}, ${crttime})`, 
                                schema, 
                                data ])

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
    console.log(db)
    const result = runSelectSQL("SELECT * FROM __cache__", true)
    if (result.success)
        cachedItems = result.rows
    else {
        console.log(result)
        // Try to re-create __cache__ table... 
        const newResult = runSQL(["CREATE TABLE __cache__ ( tabname CHAR(40), crtdate NUMERIC(8, 0), crttime NUMERIC(6,0), CONSTRAINT __cache__pk PRIMARY KEY (tabname) );"])
        console.log(newResult)
    }
    console.log(`Number of cached item${cachedItems.length>1?'s':''} ${cachedItems.length>1?'are':'is'} ${cachedItems.length}.`)
}

module.exports = { startCache, getCachedItems, isCached, addItem, removeItem } 
