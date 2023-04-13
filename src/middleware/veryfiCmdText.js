const verifyCmdText = (req, res, next) => {
    const cmdText = req.body.cmdText.trim()

    if (typeof cmdText !== 'string')
        return res.status(400).json({ success: false, message: 'cmdText must a string.'})

    if (cmdText.split(' ')[0].toLowerCase() !== 'select') 
        return res.status(400).json({ success: false, message: 'select statement expected.'})

    next()
}

module.exports = verifyCmdText 