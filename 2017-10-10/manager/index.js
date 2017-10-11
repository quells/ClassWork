const inq = require("inquirer")

class Player {
    constructor(name, position, offense, defense) {
        this.name = name
        this.position = position
        this.offense = Math.max(1, Math.min(Number(offense), 10))
        this.defense = Math.max(1, Math.min(Number(defense), 10))
    }

    goodGame() {
        if (Math.random() < 0.5) {
            this.offense += 1
        } else {
            this.defense += 1
        }
        this.offense = Math.min(this.offense, 10)
        this.defense = Math.min(this.defense, 10)
    }

    badGame() {
        if (Math.random() < 0.5) {
            this.offense -= 1
        } else {
            this.defense -= 1
        }
        this.offense = Math.max(this.offense, 1)
        this.defense = Math.max(this.defense, 1)
    }

    toString() {
        return this.name + " (" + this.position + ") [" + this.offense + "/" + this.defense + "]"
    }
}

function GetPlayer(title, i) {
    function between1and10(x) {
        return 1 <= Number(x) && Number(x) <= 10
    }

    return inq.prompt([{
        type: "input",
        name: "name",
        message: "Name for " + title + " " + i
    }, {
        type: "list",
        name: "position",
        message: "Position for " + title + " " + i,
        choices: ["Goalie", "Striker", "Forward", "Defense"]
    }, {
        type: "input",
        name: "offense",
        message: "On a scale from 1 to 10, how good is " + title + " " + i + " at offense?",
        validate: between1and10
    }, {
        type: "input",
        name: "defense",
        message: "On a scale from 1 to 10, how good is " + title + " " + i + " at defense?",
        validate: between1and10
    }])
    .then(answers => {
        return Promise.resolve({
            player: new Player(answers.name, answers.position, Number(answers.offense), Number(answers.defense)),
            index: i
        })
    })
}

function Total(team, prop) {
    var score = 0
    team.forEach(player => score += player[prop])
    return score
}

function SwapPlayers() {
    return inq.prompt([{
        type: "list",
        name: "swap",
        message: "Do you want to swap players?",
        choices: ["Yes", "No"]
    }])
    .then(answer => {
        if (answer.swap === "Yes") {
            inq.prompt([{
                type: "list",
                name: "out",
                message: "Who should sub out?",
                choices: starters.map(s => s.name)
            }, {
                type: "list",
                name: "in",
                message: "Who shoudl sub in?",
                choices: subs.map(s => s.name)
            }])
            .then(answers => {
                var outIndex = starters.map(s => s.name).indexOf(answers.out)
                var inIndex = subs.map(s => s.name).indexOf(answers.in)
                var nextStarters = []
                var nextSubs = []
                for (var i = 0; i < starters.length; i++) {
                    if (i === outIndex) {
                        nextSubs.push(starters[i])
                    } else {
                        nextStarters.push(starters[i])
                    }
                }
                for (var i = 0; i < subs.length; i++) {
                    if (i === inIndex) {
                        nextStarters.push(subs[i])
                    } else {
                        nextSubs.push(subs[i])
                    }
                }
                starters = nextStarters
                subs = nextSubs
            })
        }
    })
}

function PlayGame() {
    var teamScore = 0
    var maxPower = numStarters * 10
    var p = Promise.resolve(teamScore)
    for (var i = 0; i < gameLength; i++) {
        p = p.then(score => {
            var roundScore = 0
            var teamOffense = Total(starters, "offense")
            var teamDefense = Total(starters, "defense")
            var oppOffense = Math.ceil(maxPower * Math.random())
            var oppDefense = Math.ceil(maxPower * Math.random())
            if (teamOffense > oppDefense) { roundScore++ }
            if (teamDefense < oppOffense) { roundScore-- }
            var inner = Promise.resolve()
            if (roundScore !== 0) {
                if (roundScore > 0) {
                    console.log("You scored!")
                } else {
                    console.log("The other team scored.")
                }
                // inner = inner.then(() => SwapPlayers())
            }
            return inner.then(() => score + roundScore)
        })
    }
    return p.then(finalScore => {
        console.log("Final Score: " + finalScore)
        if (finalScore > 0) {
            console.log("You won!")
            starters.forEach(s => s.goodGame())
        } else if (finalScore < 0) {
            console.log("You lost...")
            starters.forEach(s => s.badGame())
        } else {
            console.log("It's soccer, so it was a draw.")
        }
        console.log(starters.map(s => s.toString()))
        return inq.prompt([{
            type: "list",
            name: "again",
            message: "Play Again?",
            choices: ["Yes", "No"]
        }])
        .then(answer => {
            if (answer.again === "Yes") {
                return PlayGame()
            }
        })
    })
}

var numStarters = 5
var numSubs = 1
var gameLength = 10

var starters = []
var subs = []

var p = GetPlayer("Player", 1)
for (var i = 2; i <= numStarters; i++) {
    p = p.then(playerIndex => {
        starters.push(playerIndex.player)
        return GetPlayer("Player", playerIndex.index+1)
    })
}
p = p.then(playerIndex => starters.push(playerIndex.player))

p = p.then(() => GetPlayer("Sub", 1))
for (var i = 2; i <= numSubs; i++) {
    p = p.then(playerIndex => {
        subs.push(playerIndex.player)
        return GetPlayer("Sub", playerIndex.index+1)
    })
}
p = p.then(playerIndex => subs.push(playerIndex.player))

p = p.then(() => {
    return PlayGame()
})
