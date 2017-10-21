const fs = require("fs")
const http = require("http")
const path = require("path")

function getFile(filepath, callback) {
    fs.open(filepath, "r", (err, fd) => {
        if (err) {
            callback(err)
            return
        }
        fs.readFile(fd, "utf8", (err, data) => {
            if (err) {
                callback(err)
                return
            }
            callback(null, data)
        })
    })
}

function notFound(res, path) {
    res.writeHead(404, {"Content-Type": "text/html"})
    res.end(`<html><body><h1>Not Found: ${path}</h1></body></html>`)
}

function serveHTML(res, data) {
    res.writeHead(200, {"Content-Type": "text/html"})
    res.end(data)
}

function serveCSS(res, data) {
    res.writeHead(200, {"Content-Type": "text/css"})
    res.end(data)
}

function getExt(filepath) {
    var components = filepath.split(".")
    if (components.length < 2) {
        throw new Error("no file extension found")
    }
    return components[components.length-1]
}

var server = http.createServer((req, res) => {
    var url = req.url
    var filepath = "public" + url
    if (filepath.charAt(filepath.length-1) === "/") {
        filepath += "index.html"
    }
    var ext;
    try {
        ext = getExt(filepath)
    } catch (err) {
        ext = "html"
        filepath += ".html"
    }
    getFile(filepath, (err, data) => {
        if (err) {
            return notFound(res, url)
        }
        if (ext === "html") {
            return serveHTML(res, data)
        } else if (ext === "css") {
            return serveCSS(res, data)
        }
        return notFound(res, url)
    })
})

var port = 8000
server.listen(port, () => {
    console.log("Server listening at http://localhost:" + port)
})
