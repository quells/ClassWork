const express = require("express")
const bp = require("body-parser")
const mongojs = require("mongojs")

const app = express()
const port = process.env.PORT || 8000

app.use(bp.urlencoded({extended: false}))
app.use(bp.json())

let db = mongojs("zoo", ["zoo"])
db.on("error", console.error.bind(console, "mongo error:"))

app.get("/", (req, res) => {
  res.send("Hello, world")
})

app.get("/all", (req, res) => {
  db.zoo.find((err, animals) => {
    if (err) return res.json({error: true})
    res.json({error: false, animals: animals})
  })
})

app.get("/sorted/name(/:dir)?", (req, res) => {
  var qDir = (req.params.dir === "descending") ? -1 : 1
  db.zoo.find().sort({name: qDir}, (err, animals) => {
    if (err) return res.json({error: true})
    res.json({error: false, animals: animals})
  })
})

app.get("/sorted/weight(/:dir)?", (req, res) => {
  var qDir = (req.params.dir === "descending") ? -1 : 1
  db.zoo.find().sort({weight: qDir}, (err, animals) => {
    if (err) return res.json({error: true})
    res.json({error: false, animals: animals})
  })
})

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})
