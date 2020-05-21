'use strict'

const fetch = require('node-fetch')
const cheerio = require('cheerio')

module.exports = {
    async searchManga(keyword, page = 1) {
        let uri = `https://www.maid.my.id/page/${page}/?s=${encodeURI(keyword)}`
        let $ = cheerio.load(await (await fetch(uri)).text())
        
        let data = new Array()
        $('div.row .col-6').each((i, e) => {
            let fullUrl = $(e).find('a').attr('href')
            let Title = $(e).find('a > div > .titit').text()
            let Thumb = $(e).find('a > div > img').attr('src').split('?')[0]

            data.push({ fullUrl, Title, Thumb })
        })

        let paginator = $('.pagination.mb-3 a').length
        let maxPage = null
        if ( paginator === 4 ) {
            maxPage = $('.pagination.mb-3 a:nth-child(5)').text()
        } else {
            maxPage = $('.pagination.mb-3 a:nth-child(3)').text()
        }

        return {
            data,
            maxPage: parseInt(maxPage) || null
        }
    },

    async getMangaInfo(url) {
        let $ = cheerio.load(await (await fetch(url)).text())

        let Title = $('div.infox h1').text()
        let Genres = $('div.infox .gnr a').map((i, e) => $(e).text()).get()
        let Chapters = $('ul#chapter_list li').map((i, e) => {
            return {
                chapterNumber: parseFloat($(e).find('.lchx > a > chapter').text().split(' ')[1]),
                chapterTitle: $(e).find('.lchx > a > chapter').text(),
                chapterLink: $(e).find('.lchx > a').attr('href')
            }
        }).get()

        return {
            Title, Genres, Chapters
        }
    },

    async getMangaPage(url) {
        let $ = cheerio.load(await (await fetch(url)).text())

        let Pages = $('div#readerarea p a').map((i, e) => $(e).find('img').attr('src')).get()
        return {
            total: Pages.length,
            Pages
        }
    }
}