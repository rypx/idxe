'use strict'

const idxe = require('./index')
idxe.koki.searchManga('Isekai')
    .then(x => {
        console.log(x)
    })
    .catch(x => console.error(x))