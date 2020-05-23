'use strict'

const fetch = require('node-fetch')
const cheerio = require('cheerio')

module.exports = {
    async searchManga(keyword, page = 1) {
        let url = `https://kiryuu.co/page/${page}/?s=${encodeURI(keyword)}`
        let $ = cheerio.load(await (await fetch(url)).text())

        let data = $('div.listupd .bs').map((i, e) => {
            return {
                fullUrl: $(e).find('.bsx > a').attr('href'),
                Title: $(e).find('.bsx > a').attr('title'),
                Thumb: $(e).find('.bsx > a > .limit > img').attr('src').split('?')[0]
            }
        }).get()

        let paginator = $('.pagination a').length
        let maxPage = null
        if ( paginator === 4 ) {
            maxPage = $('.pagination a:nth-child(5)').text()
        } else {
            maxPage = $('.pagination a:nth-child(3)').text()
        }
        
        return {
            data,
            maxPage
        }
    },

    async getMangaInfo(url) {
        let $ = cheerio.load(await (await fetch(url)).text())

        let Title = $('div.infox h1').text()
        let Genres = $('div.infox .spe span:first-child a').map((i, e) => $(e).text()).get()
        let Chapters = $('div.bixbox.bxcl ul li').map((i, e) => {
            return {
                chapterTitle: $(e).find('.lchx a').text(),
                chapterNumber: parseFloat($(e).find('.lchx a').text().split(' ')[1]),
                chapterUrl: $(e).find('.lchx a').attr('href')
            }
        }).get()

        return {
            Title, Genres, Chapters
        }
    },

    async getMangaPage(url) {
        let $ = cheerio.load(await (await fetch(url)).text())

        let Pages = $('div#readerarea p img').map((i, e) => $(e).attr('src')).get()
        return {
            total: Pages.length,
            Pages
        }
    }
}