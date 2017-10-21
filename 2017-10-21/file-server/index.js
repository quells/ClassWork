const fs = require("fs")
const http = require("http")
const path = require("path")

function getFile(filepath, callback) {
    fs.open(filepath, "r", (err, fd) => {
        if (err) {
            callback(err);
            return;
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

function escapeHTML(s) {
    return s
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
}

function handleFileRequest(req, res) {
    var path = req.url;
    var filepath = path.slice(1);
    getFile(filepath, (err, data) => {
        if (err) {
            res.writeHead(404, {"Content-Type": "text/html"});
            res.end("<html><body><h1>Not Found</h1></body></html>");
            return;
        }
        res.writeHead(200, {"Content-Type": "text/html"});
        res.write("<html><body><pre>" + escapeHTML(data) + "</pre></body></html>");
        res.end();
    })
}

var server = http.createServer(handleFileRequest)
var port = 8000
server.listen(port, () => {
    console.log("Server listening at http://localhost:" + port);
})
