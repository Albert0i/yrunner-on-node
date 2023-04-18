const { lowerObjKeyArray } = require('../utils/lowerKeys')
const objs = [
    {
        NAME: 'bobby hadz',
        AGE: 30,
        COUNTY: 'Chile',
    },
    {
        NAME: 'Dean',
        AGE: 45,
        COUNTY: 'America',
    },
    {
        NAME: 'Sammy',
        AGE: 39,
        COUNTY: 'America',
    }
]

console.log(objs)
console.log(lowerObjKeyArray(objs))
