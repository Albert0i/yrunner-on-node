const { startCache, getCachedItems, isCached, addItem, removeItem } = require('./cache')

startCache()

setTimeout(()=>{    
    //console.log(getCachedItems())
    //console.log(isCached('TaBlE5'))
    //console.log(isCached('Tbrelcod'))
    //addItem('table6')
    //addItem('table7')
    //console.log(getCachedItems())
    removeItem('table6')
    removeItem('table7')
    console.log(getCachedItems())
}, 1000)

