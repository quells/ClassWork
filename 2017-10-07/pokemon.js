function TypeModifier(offense, defense) {
    var types = ["Water", "Fire", "Leaf"]
    var modifierMap = [
        [1.0, 1.5, 0.5],
        [0.5, 1.0, 1.5],
        [1.5, 0.5, 1.0]
    ]
    var offType = types.indexOf(offense.type)
    var defType = types.indexOf(defense.type)
    return modifierMap[offType][defType]
}

class Pokemon {
    constructor(species, type, gender, level, atk, hp) {
        this.species = species
        this.type = type
        this.gender = gender
        this.level = level
        this.attack = atk
        this.health = hp
    }

    get alive() {
        return this.health > 0
    }

    PrintStatus() {
        var status = [this.species, "("+this.gender.charAt(0)+")", this.type + "-type", "Lvl " + this.level].join(" ") + "\n"
        status += [this.attack, "ATK", this.health, "HP"].join(" ") + "\n"
        console.log(status)
    }

    attackedBy(opp) {
        if (Math.random() < 0.1) {
            return console.log(opp.species + " missed!")
        }
        var crit = (Math.random() < 0.05) ? 2.0 : 1.0
        var dmg = Math.round(opp.attack * TypeModifier(opp, this) * crit)
        console.log([opp.species, "hit", this.species, "for", dmg, "dmg!"].join(" "))
        if (crit > 1) { console.log("Critical Hit!") }
        this.health -= dmg
    }
}

var c = new Pokemon("Charmander", "Fire", "Female", 1, 5, 16)
var s = new Pokemon("Squirtle", "Water", "Male", 1, 3, 14)

var first, second
if (Math.random() < 0.5) {
    first = c
    second = s
} else {
    first = s
    second = c
}

while (first.alive && second.alive) {
    second.attackedBy(first)
    second.PrintStatus()
    if (second.alive) {
        first.attackedBy(second)
        first.PrintStatus()
    }
}

if (first.alive) {
    console.log(first.species + " won!")
} else {
    console.log(second.species + " won!")
}
