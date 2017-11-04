// *********************************************************************************
// api-routes.js - this file offers a set of routes for displaying and saving data to the db
// *********************************************************************************

// Dependencies
// =============================================================
// var connection = require("../config/connection.js");
var model = require("../config/chirpy_model")

var defaultSQLError = {
    error: true,
    errorMsg: "SQL error"
}

// Routes
// =============================================================
module.exports = function(app) {
    app.get( "/api/chirps/all", getAllChirps)
    app.get( "/api/chirps/:id", chirpByID)
    app.post("/api/chirps/new", addChirp)

    app.post("/api/users/new", addUser)
    app.get( "/api/users/id_for/:username", idForUsername)
};

function getAllChirps(req, res) {
    model.Chirps.findAll({
        include: [model.Chirpers],
        order: [
            ["createdAt", "DESC"]
        ]
    })
    .then(chirps => {
        res.json({
            error: false,
            chirps: chirps
        })
    })
    .catch(err => {
        res.json({
            error: true,
            errorMsg: JSON.stringify(err)
        })
        res.end()
    })
}

function chirpByID(req, res) {
    model.Chirps.findAll({
        where: {
            id: req.params.id
        },
        include: [model.Chirpers]
    })
    .then(chirps => {
        if (chirps.length < 1) {
            res.json({
                error: true,
                errorMsg: "chirp does not exist"
            })
            res.end()
        } else {
            res.json({
                error: false,
                chirp: chirps[0]
            })
            res.end()
        }
    })
    .catch(err => {
        res.json({
            error: true,
            errorMsg: JSON.stringify(err)
        })
        res.end()
    })
}

function addChirp(req, res) {
    model.Chirps.create({
        chirperId: req.body.user_id,
        text: req.body.chirp
    })
    .then(response => {
        var id = response.dataValues.id
        res.json({
            error: false,
            chirp_id: id
        })
        res.end()
    })
    .catch(err => {
        res.json({
            error: true,
            errorMsg: JSON.stringify(err)
        })
        res.end()
    })
}

function addUser(req, res) {
    model.Chirpers.create({
        username: req.body.user_handle,
        real_name: req.body.real_name
    })
    .then(response => {
        var id = response.dataValues.id
        res.json({
            error: false,
            user_id: id
        })
        res.end()
    })
    .catch(err => {
        res.json({
            error: true,
            errorMsg: JSON.stringify(err)
        })
        res.end()
    })
}

function idForUsername(req, res) {
    model.Chirpers.findAll({
        where: {
            username: req.params.username
        },
        attributes: ["id"]
    })
    .then(chirperIds => {
        if (chirperIds.length < 1) {
            res.json({
                error: true,
                errorMsg: "user does not exist"
            })
            res.end()
        } else {
            res.json({
                error: false,
                id: chirperIds[0].id
            })
            res.end()
        }
    })
    .catch(err => {
        res.json({
            error: true,
            errorMsg: JSON.stringify(err)
        })
        res.end()
    })
}
