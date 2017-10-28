const express = require("express")
const bp = require("body-parser")
var Client = require("./mysqlClient")

const PORT = process.env.PORT || 8000
var app = express()

app.use(bp.urlencoded({ extended: false }))
app.use(bp.json())

function renderResults(results) {
    var html = `
<html>
<body>
<h1>Cast of Seinfield</h1>
<table cellpadding="4" border="1">
<thead>
    <tr>
        <th>Actor</th>
        <th>Character</th>
        <th>Coolness</th>
        <th>Attitude</th>
    </tr>
</thead>
<tbody>
`
    results.forEach(r => {
        html += `
    <tr>
        <td>${r.actor_name}</td>
        <td>${r.character_name}</td>
        <td>${r.coolness_points}</td>
        <td>${r.attitude}</td>
    </tr>
`
    })
    html += `
</tbody>
</table>
</body>
</html>
`
    return html
}

app.get("/cast", (req, res) => {
    var c = new Client("seinfeld_db")
    /*
    reverse(
        substring_index(
            reverse(actor_name), -- reverse name
            ' ',                 -- split on space
            1                    -- select only first word (last name)
        )
    )                            -- reverse last name again for alphabetical ordering
    */
    c.Connect()
    .then(() => c.Query("SELECT * FROM actors ORDER BY reverse(substring_index(reverse(actor_name), ' ', 1))"))
    .then(results => res.end(renderResults(results)))
})

app.get("/coolness", (req, res) => {
    var c = new Client("seinfeld_db")
    c.Connect()
    .then(() => c.Query("SELECT * FROM actors ORDER BY coolness_points DESC"))
    .then(results => res.end(renderResults(results)))
})

app.get("/attitude/:attitude", (req, res) => {
    var c = new Client("seinfeld_db")
    c.Connect()
    .then(() => c.Query("SELECT * FROM actors WHERE attitude = ? ORDER BY id", [req.params.attitude]))
    .then(results => res.end(renderResults(results)))
})

app.listen(PORT, () => console.log(`App listening at http://localhost:${PORT}`))
