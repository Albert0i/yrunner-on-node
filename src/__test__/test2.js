const { runSQL, runValueSQL, runSelectSQL, startDb, getCacheItems } = require('../lrunner')

const testing = async () => {
    await startDb('../data/db.sqlite')
    
    const result1 = await runSelectSQL("select * from tbrelcod", true)
    console.log(result1)
    const result2 = await runValueSQL("select * from tbrelcod where relcod='KK'", true)
    console.log(result2)
    const result3 = await runSQL("update tbrelcod set update_ident=update_ident+1 where relcod='KK'")
    console.log(result3)

    console.log(getCacheItems())
}

testing()
