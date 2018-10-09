import express from "express"
import { load } from "cheerio"
import request from "request"
import image from "image-downloader"
import pdfDocument from "pdfkit"
import { createWriteStream, readdir } from "fs"

const app = express()
const port = 3000

const dir = "./image/"

// https://www.mangadee.com/read/rolp04we

app.get("/download-manga", (req, res) => {
    console.log(req.body)
    const uri = req.body.uri
    const doc = new pdfDocument()
    doc.pipe(createWriteStream("./pdf/output.pdf"))
    request({ uri }, (error, response, body) => {
        const $ = load(body)
        $(".img-wrapper img").each(async function() {
            const url = $(this).attr("data-src")
            let options = {
                url,
                dest: "./image"
            }
            try {
                await image(options)
            } catch (error) {
                Promise.reject(error)
            }
        })
        readdir(dir, function(err, filenames) {
            if (err) {
                Promise.reject(error)
            }

            const filterOtherFile = filenames.filter(
                // filter other file
                file => file !== ".DS_Store" && file.indexOf("\n") < 0
            )
            filterOtherFile.forEach(filename => {
                doc.addPage().image(`./image/${filename}`, 0, 0, {
                    scale: 1,
                    width: 520
                })
            })
            doc.end()
        })
    })
    res.send("Hello World!")
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
