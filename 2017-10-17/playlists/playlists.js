const Client = require("./mysql_client.js")

class Song {
    constructor(id, title, artist, genre) {
        this.id = id
        this.title = title
        this.artist = artist
        this.genre = genre
    }

    toString() {
        return `${this.title} by ${this.artist} (${this.genre})`
    }
}

class Playlist {
    constructor(title) {
        this.id = null
        this.title = title
    }

    PullFromDatabase(db_name) {
        var client = new Client(db_name)
        client.CreateConnection()
        var pull_p = client.Connect()
        if (this.id === null) {
            pull_p = pull_p
                .then(() => client.Query(`SELECT id FROM playlists WHERE title = '${this.title}'`))
                .then(rows => {
                    if (rows.length < 1) {
                        throw new Error(`Playlist with title '${this.title}' not found`)
                    }
                    this.id = rows[0].id
                    return this.id
                })
        } else {
            pull_p = pull_p
                .then(() => this.id)
        }
        pull_p = pull_p
            .then(playlist_id => client.Query(`SELECT song_id, playlist_index FROM playlist_contents WHERE playlist_id = ${playlist_id}`))
            .then(rows => {
                var p = Promise.resolve([])
                rows.forEach(r => {
                    p = p.then(arr => {
                        return client.Query(`SELECT * FROM songs WHERE id = ${r.song_id}`)
                        .then(rows => {
                            if (rows.length < 1) {
                                throw new Error(`Song not found`)
                            }
                            var row = rows[0]
                            var song = new Song(row.id, row.title, row.artist, row.genre)
                            song.playlist_index = r.playlist_index
                            return song
                        })
                        .then(song => arr.push(song))
                        .then(() => arr)
                    })
                })
                return p
            })
            .then(songs => {
                songs.sort((a, b) => a.playlist_index - b.playlist_index)
                return songs
            })
            .then(songs => this.songs = songs)
            .catch(console.error)
            .then(() => client.Disconnect())

        return pull_p
    }
}

module.exports = {
    Song: Song,
    Playlist: Playlist,
    Initialize: function(db_name) {
        var client = new Client(db_name)
        client.CreateConnection()
        client.Connect()
            .then(() => client.Query(`
CREATE TABLE IF NOT EXISTS songs (
    id int(11) NOT NULL AUTO_INCREMENT,
    title varchar(100) NOT NULL,
    artist varchar(50) DEFAULT NULL,
    genre varchar(50) DEFAULT NULL,
    PRIMARY KEY (id)
)
`))
            .then(() => client.Query(`
CREATE TABLE IF NOT EXISTS playlists (
    id int(11) NOT NULL AUTO_INCREMENT,
    title varchar(100) NOT NULL,
    PRIMARY KEY (id)
)
`))
            .then(() => client.Query(`
CREATE TABLE playlist_contents (
    id int(11) NOT NULL AUTO_INCREMENT,
    playlist_id int(11) NOT NULL,
    song_id int(11) NOT NULL,
    playlist_index int(11) DEFAULT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (playlist_id) REFERENCES playlists(id),
    FOREIGN KEY (song_id) REFERENCES songs(id)
)
`))
            .then(() => client.Query(`
INSERT INTO songs
(title, artist, genre) VALUES
('', '', '')
`)) // TODO: Add sample data for each table
            .catch(console.error)
            .then(() => client.Disconnect())
    }
}
