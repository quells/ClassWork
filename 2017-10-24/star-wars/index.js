var express = require("express")
var bp = require("body-parser")
var path = require("path")
var db = require("./db")

var PORT = 3000
var app = express()

app.use(bp.urlencoded({ extended: false }))
app.use(bp.json())

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"))
})

app.get("/*.js", (req, res) => {
    res.sendFile(path.join(__dirname, "public", req.url.slice(1)))
})

app.get("/api/character/name/:charname", (req, res) => {
    var msg = { error: false }
    var c = db.GetCharacterByName(req.params.charname)
    if (c === null) {
        msg.error = true
        msg.errorMsg = "character not found"
    } else {
        msg.character = c
    }
    res.json(msg)
})

app.get("/api/character/id/:id", (req, res) => {
    var msg = { error: false }
    var c = db.GetCharacterById(req.params.id)
    if (c === null) {
        msg.error = true
        msg.errorMsg = "character not found"
    } else {
        msg.character = c
    }
    res.json(msg)
})

app.get("/api/characters/role/:query", (req, res) => {
    var msg = { error: false }
    msg.characters = db.GetCharactersMatchingRole(req.params.query)
    res.json(msg)
})

app.post("/api/character/new", (req, res) => {
    var name = req.body.name
    var role = req.body.role
    var age  = req.body.age
    var forcePoints = req.body.forcePoints
    var msg = { error: false }
    if (name === undefined || role === undefined || age === undefined || forcePoints === undefined) {
        msg.error = true
        msg.errorMsg = "malformed request"
        return res.json(msg)
    }
    var id = db.AddCharacter(name, role, age, forcePoints)
    msg.id = id
    res.json(msg)
})

app.listen(PORT, () => console.log(`App is listening at http://localhost:${PORT}`))
