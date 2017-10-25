class Character {
    constructor(name, role, age, forcePoints) {
        this.name = name
        this.role = role
        this.age  = age
        this.forcePoints = forcePoints
    }
}

var _charIndex = 0
var _characters = {}

function shorten(str) {
    return str.toLowerCase().split(" ").join("")
}

function AddCharacter(name, role, age, forcePoints) {
    var c = new Character(name, role, age, forcePoints)
    c.id = _charIndex
    _characters[_charIndex] = c
    return _charIndex++
}

function GetCharacterByName(name) {
    for (var id in _characters) {
        var c = _characters[id]
        if (shorten(c.name) === name) {
            return c
        }
    }
    return null
}

function GetCharacterById(id) {
    return _characters[id] || null
}

function GetCharactersMatchingRole(role) {
    var matching = []
    var shortRole = shorten(role)
    for (var id in _characters) {
        var c = _characters[id]
        if (shorten(c.role).indexOf(shortRole) >= 0) {
            matching.push(c)
        }
    }
    return matching
}

AddCharacter("Yoda", "Jedi Master", 900, 2000)
AddCharacter("Darth Maul", "Sith Lord", 200, 1200)
AddCharacter("Obi Wan Kenobi", "Jedi Knight", 60, 1350)

module.exports = {
    AddCharacter: AddCharacter,
    GetCharacterByName: GetCharacterByName,
    GetCharacterById: GetCharacterById,
    GetCharactersMatchingRole: GetCharactersMatchingRole,
}
