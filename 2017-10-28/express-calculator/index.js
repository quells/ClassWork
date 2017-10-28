const express = require("express")

var PORT = process.env.PORT || 8000
var app = express()

app.get("/", (req, res) => {
    res.send("Go to an endpoint")
})

function validate(a, b) {
    var a = Number(a)
    var b = Number(b)
    if (a === NaN) { return "error" }
    if (b === NaN) { return "error" }
    return [a, b]
}

app.get("/:operation/:a/:b", (req, res) => {
    var operands = validate(req.params.a, req.params.b)
    if (operands === "error") { return res.end("error") }
    var result
    var op
    switch (req.params.operation) {
        case "add":
            op = "+"
            result = operands[0] + operands[1]
            break
        case "subtract":
            op = "-"
            result = operands[0] - operands[1]
            break
        case "multiply":
            op = "*"
            result = operands[0] * operands[1]
            break
        case "divide":
            // if (operands[1] === 0) { return res.end("error") } // result is Nan/null, which might be useful to the client
            op = "/"
            result = operands[0] / operands[1]
            break
        default:
            return res.end("error")
    }
    res.json({
        operator: op,
        operand_a: operands[0],
        operand_b: operands[1],
        result: result
    })
})

app.listen(PORT, () => console.log(`App listening at http://localhost:${PORT}`))
