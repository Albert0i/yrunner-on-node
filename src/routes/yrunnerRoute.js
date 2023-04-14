const express = require('express')
const router = express.Router()
const verifyPassphrase = require('../middleware/verifyPassphrase')
const verifyCmdText = require('../middleware/veryfiCmdText')
const verifyCmdTextArray = require('../middleware/verifyCmdTextArray')
const verifyCmdTextInsert = require('../middleware/veryfiCmdTextInsert')
const { runSQL, runValueSQL, runSelectSQL, runInsertSQLYieldRowID } = require('../yrunner')
const { handle404 } = require('../middleware/handle404')
const url = require('url');

/*
   YRunner 
*/
router.get('/runselectsql', verifyPassphrase, verifyCmdText, async (req, res) => {
    const result = await runSelectSQL(req.body.cmdText)

    res.status(result.success ? 200 : 400).json(result)
})

router.get('/runvaluesql', verifyPassphrase, verifyCmdText, async (req, res) => {
    const result = await runValueSQL(req.body.cmdText)

    res.status(result.success ? 200 : 400).json(result)
})

router.post('/runsql', verifyPassphrase, verifyCmdTextArray, async (req, res) => {
    const result = await runSQL(req.body.cmdTexts)

    res.status(result.success ? 200 : 400).json(result)
})

router.post('/runinsertsqlyieldrowid', verifyPassphrase, verifyCmdTextInsert, async (req, res) => {
    const result = await runInsertSQLYieldRowID(req.body.cmdText, req.body.id)

    res.status(result.success ? 200 : 400).json(result)
})

/*
   RESTful API
*/
// Get all 
router.get('/:table', verifyPassphrase, async (req, res) => {
    const table = req.params.table
    const query = url.parse(req.url,true).query
    const orderBy = query.orderby
    const cmdText = `select * from ${table}` + (query.orderby? ` order by ${orderBy}` : "") 

    if (query.norun)
        return res.status(200).json({cmdText})

    const result = await runSelectSQL(cmdText)    

    res.status(result.success ? 200 : 400).json({cmdText, ...result})
})

// Get one 
router.get('/:table/:key', verifyPassphrase, async (req, res) => {
    const table = req.params.table
    const query = url.parse(req.url,true).query
    const quote = query.keytype==="string" ? "'" : ""   
    const keyname = query.keyname || "id"
    const keyvalue = req.params.key
    const cmdText = `select * from ${table} where ${keyname}=${quote}${keyvalue}${quote}`

    if (query.norun)
        return res.status(200).json({cmdText})

    const result = await runSelectSQL(cmdText)

    res.status(result.success ? 200 : 400).json({cmdText, ...result})
})

// Create one
router.post('/:table', verifyPassphrase, async (req, res) => {
    const table = req.params.table
    const query = url.parse(req.url,true).query
    let fieldList = ''
    let valueList = ''

    for (const [key, obj] of Object.entries(req.body)) {
        if (fieldList!=='') fieldList += ', '
        if (valueList!=='') valueList += ', '

        fieldList += key 
        valueList += (obj.type==='string'?"'":"") + obj.value + (obj.type==='string'?"'":"")
      }
    const cmdText = `insert into ${table} (${fieldList}) values(${valueList})`
    if (query.norun)
        return res.status(200).json({cmdText})

    const result = await runSQL([cmdText])

    res.status(result.success ? 200 : 400).json({cmdText, ...result})
})

// Update one
router.patch('/:table/:key', verifyPassphrase, async (req, res) => {
    const table = req.params.table
    const query = url.parse(req.url,true).query
    const quote = query.keytype==="string" ? "'" : ""   
    const keyname = query.keyname || "id" 
    const keyvalue = req.params.key
    let setList = ''

    for (const [key, obj] of Object.entries(req.body)) {
        if (setList!=='') setList += ', '

        setList += `${key}=${(obj.type==='string'?"'":"")}${obj.value}${(obj.type==='string'?"'":"")}`
      }
    const cmdText = `update ${table} set ${setList} where ${keyname}=${quote}${keyvalue}${quote} `
    
    if (query.norun)
        return res.status(200).json({cmdText})

    const result = await runSQL([cmdText])

    res.status(result.success ? 200 : 400).json({cmdText, ...result})
})

// Delete one 
router.delete('/:table/:key', verifyPassphrase, async (req, res) => {
    const table = req.params.table
    const query = url.parse(req.url,true).query
    const quote = query.keytype==="string" ? "'" : ""   
    const keyname = query.keyname || "id" 
    const cmdText = `delete from ${table} where ${keyname}=${quote}${req.params.key}${quote}`
    
    if (query.norun)
        return res.status(200).json({cmdText})

    const result = await runSQL([cmdText])

    res.status(result.success ? 200 : 400).json({cmdText, ...result})
})

router.all('/*', handle404)

module.exports = { router } 

/*
   node.js get url query params from http request
   https://www.codexpedia.com/node-js/node-js-get-url-query-params-from-http-request/

   Object.entries()
   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries
*/