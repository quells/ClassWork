const http = require("http");

function handleCompliments(req, res) {
    res.end("Hello! You look nice today.");
}

function handleInsults(req, res) {
    res.end("Your hair is a mess.");
}

var compliments = http.createServer(handleCompliments);
var insults = http.createServer(handleInsults);

const cPORT = 7000;
const iPORT = 7500;

compliments.listen(cPORT, function() {
    console.log("Started compliment server on :" + cPORT);
});

insults.listen(iPORT, function() {
    console.log("Started insult server on http://localhost:" + iPORT);
});
