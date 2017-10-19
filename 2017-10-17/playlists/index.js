const playlists = require("./playlists.js")
const Playlist = playlists.Playlist

const db_name = "playlist_db"

// playlists.Initialize(db_name)

var pl = new Playlist("test 2")
pl.PullFromDatabase(db_name)
    .then(() => pl.songs.map(s => s.toString()))
    .then(songs => songs.forEach(s => console.log(s)))
