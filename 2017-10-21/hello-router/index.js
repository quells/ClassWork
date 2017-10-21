
const http = require("http");

function router(req, res) {
    var path = req.url;
    switch (path) {
        case "/":
            displayRoot(path, req, res);
            break;
        case "/portfolio":
            displayPortfolio(path, req, res);
            break;
        default:
            displayNotFound(path, req, res);
            break;
    }
}

function displayRoot(path, req, res) {
    var html = `
<html>
<body>
    <h1>Home Page</h1>
    <p><a href="/portfolio">Portfolio</a></p>
</body>
</html>
`
    res.writeHead(200, {"Content-Type": "text/html"});
    res.end(html);
}

function displayPortfolio(path, req, res) {
    var html = `
<html>
<body>
    <h1>Portfolio</h1>
    <p><a href="/">Go Home</a></p>
</body>
</html>
`
    res.writeHead(200, {"Content-Type": "text/html"});
    res.end(html);
}

function displayNotFound(path, req, res) {
    var html = `
<html>
<body>
    <h1>Not Found</h1>
</body>
</html>
`
    res.writeHead(404, {"Content-Type": "text/html"});
    res.end(html);
}

var server = http.createServer(router);

const PORT = 8000;

server.listen(PORT, function() {
    console.log("Started server on http://localhost:" + PORT);
});
