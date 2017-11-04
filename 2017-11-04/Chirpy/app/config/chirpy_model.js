var Sequelize = require("sequelize")
var sequelize = require("./connection_sequelize.js")

var Chirper = sequelize.define("chirper", {
    username: { type: Sequelize.STRING },
    real_name: { type: Sequelize.STRING }
})

var Chirp = sequelize.define("chirp", {
    text: { type: Sequelize.STRING }
})

Chirper.hasMany(Chirp)
Chirp.belongsTo(Chirper)

Chirper.sync()
Chirp.sync()

module.exports = {
    Chirpers: Chirper,
    Chirps: Chirp
}
