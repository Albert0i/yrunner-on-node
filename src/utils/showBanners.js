const { runSelectSQL } = require('../yrunner')

const showBanners = async () => {
    const result = await runSelectSQL('select banner from v$version')
    if (result.success)
        result.rows.forEach(row => console.log(row.BANNER))
}

module.exports = { showBanners } 