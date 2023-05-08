const express = require('express')
const router = express.Router()
const verifyPassphrase = require('../middleware/verifyPassphrase')
const { runSelectSQL } = require('../yrunner')
const { handle404 } = require('../middleware/handle404')
const dbConfig = require('../config/dbConfig');
const { convertToCreateSQL, convertToInsertSQL } = require('../utils/convertToSQL')
const { getCachedItems, addItem, removeItem } = require('../cache')
const url = require('url');

router.post('/schema/:table', verifyPassphrase, async (req, res) => {
    const table = req.params.table.toLowerCase()
    const sql = schemaSQL.replace('myOwner', dbConfig.user).replace('myTable', table)
    const result = await runSelectSQL(sql, true)

    res.status(result.success ? 200 : 400).json({...result, pm_id: process.env.pm_id})
})

router.post('/schema/:table/sqlite', verifyPassphrase, async (req, res) => {
    const table = req.params.table.toLowerCase()
    const sql = schemaSQL.replace('myOwner', dbConfig.user).replace('myTable', table)
    const result = await runSelectSQL(sql, true)

    if (result.success)
        res.status(200).json({ success: true, sql: convertToCreateSQL(table, result.rows), pm_id: process.env.pm_id})
    else 
        res.status(400).json({...result, pm_id: process.env.pm_id})
})

router.post('/schema/:table/data', verifyPassphrase, async (req, res) => {
    const table = req.params.table.toLowerCase()
    const result = await runSelectSQL(`SELECT * FROM ${table}`, true)
    
    if (result.success) 
        res.status(200).json({ success: true, sql: convertToInsertSQL(table, result.rows), pm_id: process.env.pm_id})
    else 
        res.status(400).json({...result, pm_id: process.env.pm_id})
})

router.post('/status', verifyPassphrase, async (req, res) => {
    const result = getCachedItems()    
    res.status(200).json(result)
})

router.post('/load/:table', verifyPassphrase, async (req, res) => {
    const table = req.params.table.toLowerCase()
    const query = url.parse(req.url,true).query
    const _singleStep = query._singleStep

    // schema 
    const sql = schemaSQL.replace('myOwner', dbConfig.user).replace('myTable', table)
    const resultSchema = await runSelectSQL(sql, true)

    if (resultSchema.success && resultSchema.rows.length !== 0) 
    {
        const schema = convertToCreateSQL(table, resultSchema.rows)
        // data     
        const resultData = await runSelectSQL(`SELECT * FROM ${table}`, true)
        const data = convertToInsertSQL(table, resultData.rows)
    
        const result = addItem(req.params.table, schema, data, _singleStep)
        
        res.status(result ? 200 : 400).json({...result, pm_id: process.env.pm_id})
    } else {
        res.status(400).json({ success: false, message: "ORA-00942: table or view does not exist", pm_id: process.env.pm_id})
    }

    
})

router.post('/unload/:table', verifyPassphrase, async (req, res) => {
    const result = removeItem(req.params.table.toLowerCase())

    res.status(result ? 200 : 400).json({...result, pm_id: process.env.pm_id})
})


router.all('/*', handle404)

module.exports = { router } 

const schemaSQL = `SELECT f1.COLUMN_NAME, f1.DATA_TYPE, f1.DATA_LENGTH, f1.DATA_PRECISION, f1. DATA_SCALE, f3.POSITION 
    FROM ALL_TAB_COLUMNS f1 
    LEFT JOIN ALL_CONSTRAINTS f2 
    ON F1.OWNER = f2.OWNER and f1.TABLE_NAME=f2.TABLE_NAME and f2.CONSTRAINT_TYPE='P' 
    LEFT JOIN ALL_CONS_COLUMNS f3 
    ON f2.OWNER = f3.OWNER and f2.CONSTRAINT_NAME=f3.CONSTRAINT_NAME and f1.COLUMN_NAME=f3.COLUMN_NAME 
    WHERE f1.OWNER = UPPER('myOwner') AND f1.TABLE_NAME = UPPER('myTable') 
    order by f1.COLUMN_ID`

/*
   List all primary keys (PKs) and their columns in Oracle database
   https://dataedo.com/kb/query/oracle/list-all-primary-keys-and-their-columns

   3 Ways to Check Column Data Type in Oracle
   https://database.guide/3-ways-to-check-column-data-type-in-oracle/?fbclid=IwAR10KhnWLh6B6ERbFkkSjUXdJeSPDp36AY02dQ8dO4duFELbaXpBcONgBiE

*/