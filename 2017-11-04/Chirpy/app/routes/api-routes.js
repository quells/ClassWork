// *********************************************************************************
// api-routes.js - this file offers a set of routes for displaying and saving data to the db
// *********************************************************************************

// Dependencies
// =============================================================
var connection = require("../config/connection.js");

var defaultSQLError = {
    error: true,
    errorMsg: "SQL error"
}

// Routes
// =============================================================
module.exports = function(app) {

    // Get all chirps
    app.get("/api/chirps/all", (req, res) => {
        connection.query(`
            SELECT
            t.id, t.chirp, t.created_at,
            t.author_id, a.username, a.real_name
            FROM chirps AS t
            JOIN chirpers AS a
            ON t.author_id = a.id
            ORDER BY t.created_at DESC
            LIMIT 10
            `,
            (err, results) => {
                if (err) {
                    res.json(defaultSQLError)
                    return res.end()
                }
                results = results.map(r => {
                    return {
                        id: r.id,
                        text: r.chirp,
                        created_at: r.created_at,
                        author_id: r.author_id,
                        user_handle: r.username,
                        user_real: r.real_name
                    }
                })
                res.json({
                    error: false,
                    chirps: results
                })
                res.end()
            })
    })

    // Get single chirp by id
    app.get("/api/chirps/:id", (req, res) => {
        connection.query(`
            SELECT
            t.id, t.chirp, t.created_at,
            t.author_id, a.username, a.real_name
            FROM chirps AS t
            JOIN chirpers AS a
            ON t.author_id = a.id
            WHERE t.id = ?
            `,
            [req.params.id],
            function(err, results) {
                if (err) {
                    res.json(defaultSQLError)
                    return res.end()
                }
                var r = results[0]
                res.json({
                    error: false,
                    chirp: {
                        id: r.id,
                        text: r.chirp,
                        created_at: r.created_at,
                        author_id: r.author_id,
                        user_handle: r.username,
                        user_real: r.real_name
                    }
                })
                res.end()
            })
    })

    // Add a chirp
    app.post("/api/chirps/new", (req, res) => {
        connection.query(`
            INSERT INTO chirps
            (author_id, chirp)
            VALUE
            (?, ?)`,
            [req.body.user_id, req.body.chirp],
            function(err) {
                if (err) {
                    console.log(req.body, err)
                    res.json(defaultSQLError)
                    return res.end()
                }
                // might be a problem if load is too high
                connection.query("SELECT LAST_INSERT_ID()", function(err, results) {
                    if (err) {
                        console.log(req.body, err)
                        res.json(defaultSQLError)
                        return res.end()
                    }
                    res.json({
                        error: false,
                        chirp_id: results[0]["LAST_INSERT_ID()"]
                    })
                    res.end()
                })
            })
    })

    // Add a user
    app.post("/api/users/new", (req, res) => {
        connection.query(`
            INSERT INTO chirpers
            (username, real_name)
            VALUE
            (?, ?)`,
            [req.body.user_handle, req.body.real_name],
            function(err) {
                if (err) {
                    res.json(defaultSQLError)
                    return res.end()
                }
                // might be a problem if load is too high
                connection.query("SELECT LAST_INSERT_ID()", function(err, results) {
                    if (err) {
                        res.json(defaultSQLError)
                        return res.end()
                    }
                    res.json({
                        error: false,
                        user_id: results[0]["LAST_INSERT_ID()"]
                    })
                    res.end()
                })
            })
    })

    // Get id for username
    app.get("/api/users/id_for/:username", (req, res) => {
        connection.query(`
            SELECT id
            FROM chirpers AS a
            WHERE a.username = ?
            `,
            [req.params.username],
            (err, results) => {
                if (err) {
                    res.json(defaultSQLError)
                    return res.end()
                }
                if (results.length < 1) {
                    res.json({
                        error: true,
                        errorMsg: "user does not exist"
                    })
                    return res.end()
                }
                res.json({
                    error: false,
                    id: results[0].id
                })
                res.end()
            })
    })

};
