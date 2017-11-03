const path = require("path")
const express = require("express")
const bodyparser = require("body-parser")
const exphbs = require("express-handlebars")

const db = require("./db")

const PORT = process.env.PORT || 8000

var app = express()

app.use(bodyparser.urlencoded({ extended: false }))
app.use(bodyparser.json())

app.engine("handlebars", exphbs({defaultLayout: "main"}))
app.set("view engine", "handlebars")

app.get("/", (req, res) => {
    db.allQuotes()
    .then(quotes => {
        res.render("index", {
            quotes: quotes
        })
    })
})

app.post("/api/update", (req, res) => {
    var id = req.body.id
    db.updateQuote(id, req.body.author, req.body.quote)
    .then(() => {
        res.json({
            error: false,
            id: id,
            author: req.body.author,
            quote: req.body.quote
        })
        res.end()
    })
})

app.put("/api/add", (req, res) => {
    db.addQuote(req.body.author, req.body.quote)
    .then(quote => {
        res.json({
            error: false,
            id: quote.id,
            author: quote.author,
            quote: quote.quote
        })
        res.end()
    })
})

app.delete("/api/delete", (req, res) => {
    var id = req.body.id
    db.deleteQuote(id)
    .then(() => {
        res.json({
            error: false,
            id: id
        })
        res.end()
    })
})

const assetsDir = path.join(path.dirname(module.filename), "public", "assets")
app.get("/assets/:type/:filename", (req, res) => {
    var filepath = path.join(assetsDir, req.params.type, req.params.filename)
    res.sendFile(filepath, )
})

app.listen(PORT, () => console.log(`App listening at http://localhost:${PORT}`))
