const playlists = require("./playlists.js")
const Playlist = playlists.Playlist

const db_name = "playlist_db"

// playlists.Initialize(db_name)

var pl = new Playlist("test")
pl.PullFromDatabase(db_name)
    .then(() => {
        console.log(pl)
    })
