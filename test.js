'use strict'

const idxe = require('./index')
idxe.kiry.getMangaPage('https://kiryuu.co/akatsuki-no-yona-chapter-75/')
    .then(x => console.log(x))