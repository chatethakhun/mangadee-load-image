import express from 'express'
import { load } from 'cheerio'
import request from 'request'
import image from 'image-downloader'
import pdfDocument from 'pdfkit'
import { createWriteStream, readdirSync } from 'fs'

const app = express()
const port = 3000
const doc = new pdfDocument()

doc.pipe(createWriteStream('./pdf/output.pdf'))

const dir = './image'

app.get('/download-manga', (req, res) => {
    request(
        { uri: 'https://www.mangadee.com/read/rolp04we' },
        (error, response, body) => {
            const $ = load(body)
            $('.img-wrapper img').each(async function() {
                const url = $(this).attr('data-src')
                let options = {
                    url,
                    dest: './image'
                }
                try {
                    await image(options)
                    setTimeout(() => {
                        readdirSync(dir).forEach(async file => {
                            if (file !== '.DS_Store') {
                                console.log('file', file)
                                await doc.addPage().image(`./image/${file}`, {
                                    // fit: [500, 400],
                                    align: 'center',
                                    valign: 'center'
                                })
                            }
                        })
                        doc.end()
                    }, 3000)
                } catch (error) {
                    console.error(error)
                }
            })
        }
    )
    res.send('Hello World!')
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
