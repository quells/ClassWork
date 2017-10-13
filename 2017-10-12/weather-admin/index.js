const fs = require("fs")
const inq = require("inquirer")
const weather = require("weather-js")

const logFile = "log.txt"

var user_input = process.argv[2]
switch (user_input) {
    case "admin":
        handleAdmin()
        break
    case "user":
        if (process.argv.length < 5) {
            handleUser()
        } else {
            logAndRunWeatherRequest({
                name: process.argv[3],
                city: process.argv.slice(4).join(" ")
            })
        }
        break
    case "test":
        logAndRunWeatherRequest({
            name: "test",
            city: "San Diego, CA"
        })
        break
    default:
        console.log("not allowed")
        break
}

function doesFileExist(filepath) {
    return new Promise((resolve, reject) => {
        fs.stat(filepath, (err, stat) => {
            if (err) {
                resolve(false)
            } else {
                resolve(true)
            }
        })
    })
}

function appendToFile(filepath, data) {
    return new Promise((resolve, reject) => {
        fs.appendFile(filepath, data, function (err){
            if (err){
                reject(err)
            } else {
                resolve(filepath)
            }
        });
    })
}

function createFileIfNotExists(filepath) {
    return doesFileExist(filepath)
    .then(exists => {
        if (!exists) {
            return appendToFile(filepath, "")
        }
        return Promise.resolve(filepath)
    })
}

function readFile(filepath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filepath, "utf8", (err, data) => {
            if (err) {
                reject(err)
            } else {
                resolve(data)
            }
        });
    })
}

function handleAdmin() {
    console.log("Access Log:\n")
    createFileIfNotExists(logFile)
    .then(file => readFile(file))
    .then(data => {
    // Print contents of log.txt
        console.log(data)
    })
    .catch(console.error)
}

function handleUser() {
    // inquirer: ask for name
    // inquirer: ask for city
    inq.prompt([{
        type: "input",
        name: "name",
        message: "What is your name?"
    }, {
        type: "input",
        name: "city",
        message: "Type in a City"
    }])
    // factored out for faster testing iteration
    .then(logAndRunWeatherRequest)
    .catch(console.error)
}

function logAndRunWeatherRequest(responses) {
    createFileIfNotExists(logFile)
    .then(file => {
    // append to log.txt city and time
        return appendToFile(file, responses.name + ": `" + responses.city + "` at " + (new Date).getTime() + "\n")
    })
    .then(() => {
    // run weather api request with city
        weather.find({
            search: responses.city,
            degreeType: "F"
        }, (err, results) => {
            if (err) {
                console.log(err)
            } else {
                // display results
                var result = results[0]
                var degreeType = result.location.degreetype
                console.log("\n")
                console.log("City: " + result.location.name + "\nAt: "
                + result.current.observationtime + "\n");

                console.log("Current Temp: " + result.current.temperature + degreeType);
                console.log("The sky is: " + result.current.skytext);
                console.log("It feels like: " + result.current.feelslike + degreeType);
                console.log("\n");

                console.log("Three Day Forecast \n");
                for (var i = 2; i < result.forecast.length; i++) {
                    var forecast = result.forecast[i];
                    console.log(forecast.day + " " + forecast.date);
                    console.log("Low Temp: " + forecast.low + degreeType);
                    console.log("High Temp: " + forecast.high + degreeType);
                    console.log("The skies will be: " + forecast.skytextday);
                    console.log("\n");
                }
            }
        })
    })
}
