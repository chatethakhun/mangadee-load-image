import express from "express"
import { load } from "cheerio"
import request from "request"
import image from "image-downloader"
import pdfDocument from "pdfkit"
import {
    createWriteStream,
    readdir,
    rmdirSync,
    existsSync,
    mkdirSync,
    readdirSync,
    lstatSync,
    unlinkSync
} from "fs"
import bodyParser from "body-parser"

const app = express()
const port = 3000
const dir = "./image/"
const pdfDir = "./pdf"

app.use(bodyParser.json()) // to support JSON-encoded bodies
app.use(
    bodyParser.urlencoded({
    // to support URL-encoded bodies
        extended: true
    })
)

const deleteFolderRecursive = path => {
    if (existsSync(path)) {
        readdirSync(path).forEach(file => {
            var curPath = path + "/" + file
            if (lstatSync(curPath).isDirectory()) {
                // recurse
                deleteFolderRecursive(curPath)
            } else {
                // delete file
                unlinkSync(curPath)
            }
        })
        rmdirSync(path)
    } else {
        Promise.reject("path not found")
    }
}

app.post("/download-manga", (req, res) => {
    const uri = req.body.uri
    const doc = new pdfDocument()
    doc.pipe(createWriteStream("./pdf/output.pdf"))
    if (uri) {
        if (!existsSync(dir)) {
            mkdirSync(dir)
        }
        if (!existsSync(pdfDir)) {
            mkdirSync(pdfDir)
        }
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
                    // add pdf
                    doc.addPage().image(`./image/${filename}`, 0, 0, {
                        scale: 1,
                        width: 520
                    })
                })
                doc.end()
            })
        })
        deleteFolderRecursive(dir)
        res.jsonp({
            result: true,
            message: "Success"
        })
    } else {
        res.jsonp({
            result: false,
            message: "require uri"
        })
    }
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
