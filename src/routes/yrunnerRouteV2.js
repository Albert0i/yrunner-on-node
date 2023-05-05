const express = require('express')
const router = express.Router()
const verifyPassphrase = require('../middleware/verifyPassphrase')
const verifyCmdText = require('../middleware/veryfiCmdText')
const verifyCmdTextArray = require('../middleware/verifyCmdTextArray')
const verifyCmdTextInsert = require('../middleware/veryfiCmdTextInsert')
const { runSQL, runValueSQL, runSelectSQL, runInsertSQLYieldRowID } = require('../yrunner')
const { isCached } = require('../cache')
const { runSelectSQL:runSelectSQLFromCache, runSQL:runSQLFromCache } = require('../srunner')
const { handle404 } = require('../middleware/handle404')
const url = require('url');

/*
   YRunner Direct 
*/
router.post('/runselectsql', verifyPassphrase, verifyCmdText, async (req, res) => {
    const result = await runSelectSQL(req.body.cmdText, req.body.lowerKeys)

    res.status(result.success ? 200 : 400).json({...result, pid: process.env.NODE_APP_INSTANCE})
})

router.post('/runvaluesql', verifyPassphrase, verifyCmdText, async (req, res) => {
    const result = await runValueSQL(req.body.cmdText, req.body.lowerKeys)

    res.status(result.success ? 200 : 400).json({...result, pid: process.env.NODE_APP_INSTANCE})
})

router.post('/runsql', verifyPassphrase, verifyCmdTextArray, async (req, res) => {
    const result = await runSQL(req.body.cmdTexts)

    res.status(result.success ? 200 : 400).json({...result, pid: process.env.NODE_APP_INSTANCE})
})

router.post('/runinsertsqlyieldrowid', verifyPassphrase, verifyCmdTextInsert, async (req, res) => {
    const result = await runInsertSQLYieldRowID(req.body.cmdText, req.body.id)

    res.status(result.success ? 201 : 400).json({...result, pid: process.env.NODE_APP_INSTANCE})
})

/*
   YRunner RESTful
*/
// Get all 
router.get('/:table', verifyPassphrase, async (req, res) => {
    const table = req.params.table.toLowerCase()
    const query = url.parse(req.url,true).query
    const _filter = query._filter
    const _sort = query._sort
    const _order = query._order
    const _offset = query._offset
    const _limit = query._limit
    const _lowerKeys = query._lowerKeys
    let cmdText = `SELECT * FROM ${table} ` +
                     (query._filter? `WHERE ${_filter} ` : ' ') + 
                     (query._sort? `ORDER BY ${_sort} ` : ' ') +
                     (query._order? `${_order} ` : ' ') + 
                     (query._offset? `OFFSET ${_offset} ROWS ` : ' ') + 
                     (query._limit? `FETCH NEXT ${_limit} ROWS ONLY ` : ' ')

    if (query._norun)
        return res.status(200).json({cmdText})
    
    //const result = await runSelectSQL(cmdText, _lowerKeys)
    let result = null
    if (isCached(table)) {
        cmdText = `SELECT * FROM ${table} ` +
                   (query._filter? `WHERE ${_filter} ` : ' ') + 
                   (query._sort? `ORDER BY ${_sort} ` : ' ') +
                   (query._order? `${_order.toUpperCase()} ` : ' ') + 
                   (query._limit? `LIMIT ${_limit} ` : ' ') + 
                   (query._offset? `OFFSET ${_offset} ` : ' ')
            result = runSelectSQLFromCache(cmdText, _lowerKeys)
    }
    else
        result = await runSelectSQL(cmdText, _lowerKeys)

    res.status(result.success ? 200 : 400).json({
        cmdText, 
        ...result, 
        isCached: 
        isCached(table), 
        pid: process.env.NODE_APP_INSTANCE
    })
})

// Get one 
router.get('/:table/:key', verifyPassphrase, async (req, res) => {
    const table = req.params.table.toLowerCase()
    const query = url.parse(req.url,true).query    
    const _keyname = query._keyname || "id"
    const quote = query._keytype==="string" ? "'" : ""   
    const keyvalue = req.params.key
    const _lowerKeys = query._lowerKeys
    const cmdText = `SELECT * FROM ${table} WHERE ${_keyname}=${quote}${keyvalue}${quote}`

    if (query._norun)
        return res.status(200).json({cmdText})    
    
    //const result = await runSelectSQL(cmdText, _lowerKeys)
    let result = null;
    if (isCached(table))
        result = runSelectSQLFromCache(cmdText, _lowerKeys)
    else
        result = await runSelectSQL(cmdText, _lowerKeys)

    res.status(result.success ? 200 : 400).json({
        cmdText, 
        success: result.success, 
        row: (result.rows[0] ? result.rows[0] : null), 
        isCached: isCached(table), 
        pid: process.env.NODE_APP_INSTANCE
    })
})

// Create one
router.post('/:table', verifyPassphrase, async (req, res) => {
    const table = req.params.table.toLowerCase()
    const query = url.parse(req.url,true).query
    let fieldList = ''
    let valueList = ''

    for (const [key, value] of Object.entries(req.body)) {
        if (fieldList!=='') fieldList += ', '
        if (valueList!=='') valueList += ', '
        
        fieldList += key 
        valueList += ((typeof value)==='string'?"'":"") + value + ((typeof value)==='string'?"'":"")
    }
    const cmdText = `INSERT INTO ${table} (${fieldList}) VALUES(${valueList})`

    if (query._norun)
        return res.status(200).json({cmdText})

    const result = await runSQL([cmdText])
    if (isCached(table)) {
        cacheResult = runSQLFromCache([cmdText])
        if (!cacheResult.success)
            console.log(cacheResult)
        return res.status(result.success ? 201 : 400).json({
            cmdText, 
            ...result, 
            cacheInsert: 
            cacheResult.success, 
            pid: process.env.NODE_APP_INSTANCE
        })    
    }
    res.status(result.success ? 201 : 400).json({
        cmdText, 
        ...result, 
        pid: process.env.NODE_APP_INSTANCE
    })
})

// Update one
router.patch('/:table/:key', verifyPassphrase, async (req, res) => {
    const table = req.params.table.toLowerCase()
    const query = url.parse(req.url,true).query    
    const _keyname = query._keyname || "id" 
    const quote = query._keytype==="string" ? "'" : ""   
    const keyvalue = req.params.key
    let setList = ''

    for (const [key, value] of Object.entries(req.body)) {
        if (setList!=='') setList += ', '
        
        setList += `${key}=${((typeof value)==='string'?"'":"")}${value}${((typeof value)==='string'?"'":"")}`
    }
    const cmdText = `UPDATE ${table} SET ${setList} WHERE ${_keyname}=${quote}${keyvalue}${quote} `
    
    if (query._norun)
        return res.status(200).json({cmdText})

    const result = await runSQL([cmdText])
    if (isCached(table)) {
        cacheResult = runSQLFromCache([cmdText])
        if (!cacheResult.success)
            console.log(cacheResult)
        return res.status(result.success ? 201 : 400).json({
            cmdText, 
            ...result, 
            cacheUpdate: cacheResult.success,
            pid: process.env.NODE_APP_INSTANCE
        })    
    }
    res.status(result.success ? 200 : 400).json({
        cmdText, 
        ...result,
        pid: process.env.NODE_APP_INSTANCE
    })
})

// Delete one 
router.delete('/:table/:key', verifyPassphrase, async (req, res) => {
    const table = req.params.table.toLowerCase()
    const query = url.parse(req.url,true).query    
    const _keyname = query._keyname || "id" 
    const quote = query._keytype==="string" ? "'" : ""   
    const keyvalue = req.params.key
    const cmdText = `DELETE FROM ${table} WHERE ${_keyname}=${quote}${keyvalue}${quote}`
    
    if (query._norun)
        return res.status(200).json({cmdText})

    const result = await runSQL([cmdText])
    if (isCached(table)) {
        cacheResult = runSQLFromCache([cmdText])
        if (!cacheResult.success)
            console.log(cacheResult)
        return res.status(result.success ? 201 : 400).json({
            cmdText, 
            ...result, 
            cacheDelete: cacheResult.success,
            pid: process.env.NODE_APP_INSTANCE
        })    
    }
    res.status(result.success ? 200 : 400).json({
        cmdText, 
        ...result,
        pid: process.env.NODE_APP_INSTANCE
    })
})

router.all('/*', handle404)

module.exports = { router } 

/*
   node.js get url query params from http request
   https://www.codexpedia.com/node-js/node-js-get-url-query-params-from-http-request/

   Object.entries()
   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries
*/