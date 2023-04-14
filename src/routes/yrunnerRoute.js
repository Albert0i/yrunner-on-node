const express = require('express')
const router = express.Router()
const verifyPassphrase = require('../middleware/verifyPassphrase')
const verifyCmdText = require('../middleware/veryfiCmdText')
const verifyCmdTextArray = require('../middleware/verifyCmdTextArray')
const verifyCmdTextInsert = require('../middleware/veryfiCmdTextInsert')
const { runSQL, runValueSQL, runSelectSQL, runInsertSQLYieldRowID } = require('../yrunner')
const { handle404 } = require('../utils/handle404')

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

router.all('/*', handle404)

module.exports = router