const express = require("express")
const hbs = require("handlebars")
const exphbs = require("express-handlebars")
const db = require("./db")

var PORT = process.env.PORT || 8000
var app = express()
app.engine("handlebars", exphbs({defaultLayout: "main"}))
app.set("view engine", "handlebars")

var shortenName = name => name.split(" ").join("")
hbs.registerHelper("shortenName", shortenName)

function renderAllIceCreams(req, res) {
    res.render("all", {
        icecreams: db.icecreams
    })
}

app.get("/", renderAllIceCreams)
app.get("/flavors", renderAllIceCreams)

app.get("/flavors/:flavor", (req, res) => {
    for (var i = 0; i < db.icecreams.length; i++) {
        var icecream = db.icecreams[i]
        var name = shortenName(icecream.name)
        if (name === req.params.flavor) {
            return res.render("single", icecream)
        }
    }
    res.render("notfound", {flavor: req.params.flavor})
})

app.listen(PORT, () => console.log(`App listening at http://localhost:${PORT}`))
