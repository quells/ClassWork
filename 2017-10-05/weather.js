var geocoder = require("geocoder")
var weather = require("weather-js")

if (process.argv.length < 3) {
    return console.log("Please enter a location")
}

var input = process.argv.slice(2).join(" ")
geocoder.geocode(input, (err, data) => {
    if (err) { return console.log(err) }
    if (data.results.length < 1) { return console.log("No results found for that location") }
    var result = data.results[0]
    console.log("Loading weather for " + result.formatted_address + "\n---")
    weather.find({
        search: result.formatted_address,
        degreeType: "F"
    }, (err, results) => {
        if (results.length < 1) { return console.log("No results found for that location") }
        var result = results[0]
        console.log("It is currently " + result.current.temperature + "F and " + result.current.skytext + " in " + result.location.name)
        console.log("---")
        console.log("5 Day Forecast")
        result.forecast.forEach(f => {
            console.log(f.shortday + ": " + f.skytextday + " " + f.low + "-" + f.high + "F")
        })
    })
})
