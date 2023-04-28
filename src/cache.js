const { runSQL, runValueSQL, runSelectSQL, openDb } = require('./lrunner')
const { yyyymmdd, hhmmss } = require('./utils/datetime')

let cachedItems = []

const getCachedItems = () => {
    return cachedItems
}

const isCached = (name) => {    
    const lcName = name.toLowerCase()

    return cachedItems.find(row => row.tabname.toLowerCase() === lcName);
}

const addItem = async (name) => {
    const lcName = name.toLowerCase()

    if (! isCached(lcName)) 
    {        
        try {
            const crtdate = yyyymmdd()
            const crttime = hhmmss()
            // Add entry to cache             
            const result = await runSQL(`insert into cache values('${lcName}', ${crtdate}, ${crttime})`)
            // Load data to cache 

            // Add entry memory!!!
            cachedItems.push({ tabname: lcName, crtdate, crttime})
            return result
        } catch (err) {
            console.log(err)
            return err
        }    
    } else 
    return {
        "success": false,
        "message": `${name} already loaded`
        }
}

const removeItem = async (name) => {
    const lcName = name.toLowerCase()

    if (isCached(lcName)) 
    {   
        // Remove entry from memory!!!
        cachedItems = cachedItems.filter(row => row.tabname !== lcName)
        try {
            // Remove entry from cache 
            const result = await runSQL(`delete from cache where tabname='${lcName}'`)
            // Remove data from cache 

            return result 
        } catch (err) {
            console.log(err)
            return err
        }
    } else 
        return {
                "success": false,
                "message": `${name} not yet loaded`
                }
}

const startCache = async(filename='db.sqlite') => {
    try {
        const db = await openDb(filename)
        console.log(db)
        const result = await runSelectSQL("select * from cache", true)
        if (result.success)
        {
            cachedItems = result.rows
            console.log(`Cached item${cachedItems.length>1?'s':''} is ${cachedItems.length}`)
        }
    } catch (err) {
        console.log(err)
    }
}

module.exports = { startCache, getCachedItems, isCached, addItem, removeItem } 
