const express = require('express')
const router = express.Router()
const verifyPassphrase = require('../middleware/verifyPassphrase')
const verifyCmdText = require('../middleware/veryfiCmdText')
const verifyCmdTextArray = require('../middleware/verifyCmdTextArray')
const { runSQL, runValueSQL, runSelectSQL, RunInsertSQLYieldRowID } = require('../yrunner')

router.post('/runselectsql', verifyPassphrase, verifyCmdText, async (req, res) => {
    const result = await runSelectSQL(req.body.cmdText)

    res.status(result.success ? 200 : 400).json(result)
})

router.post('/runvaluesql', verifyPassphrase, verifyCmdText, async (req, res) => {
    const result = await runValueSQL(req.body.cmdText)

    res.status(result.success ? 200 : 400).json(result)
})

router.post('/runsql', verifyPassphrase, verifyCmdTextArray, async (req, res) => {
    const result = await runSQL(req.body.cmdTexts)

    res.status(result.success ? 200 : 400).json(result)
})

module.exports = router