// const Client = require("./mysql_client.js").Client
const playlists = require("./playlists.js")
const Playlist = playlists.Playlist

const db_name = "test_db"

playlists.Initialize(db_name)

// var pl = new Playlist("test")
// pl.PullFromDatabase(db_name)
//     .then(() => {
//         console.log(pl)
//     })
