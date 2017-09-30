var interpreter = require("./interpreter.js");

if (process.argv.length < 3) {
    console.log("Please enter a query");
    return;
}

var query = process.argv.slice(2).join("").split(" ").join("");

try {
    var result = interpreter.evaluate(query);
    console.log(result);
} catch (err) {
    console.log(query);
    console.log(err);
}
