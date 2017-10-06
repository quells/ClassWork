
const fs = require("fs")

// load transactions
var transactions = fs.readFileSync("bank.txt", "utf8").trim().split(", ").map(Number)

function total() {
    var sum = transactions.reduce((a, b) => a + b)
    return sum.toFixed(2)
}

function printTotal() {
    console.log("$" + total())
}

switch (process.argv[2]) {
    case "total":
        printTotal()
        break
    case "deposit":
        var amount = Number(process.argv[3]).toFixed(2)
        transactions.push(Number(amount))
        printTotal()
        break
    case "withdraw":
        var amount = Number(process.argv[3]).toFixed(2)
        if (amount < total()) {
            transactions.push(-Number(amount))
        } else {
            console.log("overdraw!")
        }
        printTotal()
        break
    case "lotto":
        transactions.push(-0.25)
        if (Math.random() < 0.1) {
            transactions.push(2)
            console.log("You won!")
        }
        printTotal()
        break
    default:
        break
}

// write transactions
fs.writeFileSync("bank.txt", transactions.join(", "))
