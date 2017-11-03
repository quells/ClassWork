const Client = require("./mysqlClient")

const _db_name = "quotes_db";

class Quote {
    constructor(id, author, quote) {
        this.id = id
        this.author = author
        this.quote = quote
    }
}

module.exports = {
    allQuotes: function() {
        var client = new Client(_db_name)
        return client.connect()
        .then(() => client.query("SELECT * FROM quotes"))
        .then(rows => rows.map(r => new Quote(r.id, r.author, r.quote)))
        .catch(console.trace)
        .then(results => {
            client.disconnect()
            return results
        })
    },
    addQuote: function(author, quote) {
        var client = new Client(_db_name)
        return client.connect()
        .then(() => client.query("INSERT INTO quotes (author, quote) VALUE (?, ?)", [author, quote]))
        .then(() => client.query("SELECT * FROM quotes WHERE id = LAST_INSERT_ID()"))
        .then(rows => {
            var r = rows[0]
            return new Quote(r.id, r.author, r.quote)
        })
        .catch(console.trace)
        .then(results => {
            client.disconnect()
            return results
        })
    },
    updateQuote: function(id, author, quote) {
        var client = new Client(_db_name)
        return client.connect()
        .then(() => client.query("UPDATE quotes SET author = ?, quote = ? WHERE id = ?", [author, quote, id]))
        .catch(console.trace)
        .then(client.disconnect())
    },
    deleteQuote: function(id) {
        var client = new Client(_db_name)
        return client.connect()
        .then(() => client.query("DELETE FROM quotes WHERE id = ?", [id]))
        .catch(console.trace)
        .then(client.disconnect())
    },
}
