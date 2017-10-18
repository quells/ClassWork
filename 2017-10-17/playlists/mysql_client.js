const mysql = require("mysql")

class Client {
    constructor(database_name) {
        this.connected = false
        this.connection = null
        this.database_name = database_name
    }

    CreateConnection() {
        this.connection = mysql.createConnection({
            host: "localhost",
            port: 3306,
            user: "root",
            password: "",
            database: this.database_name
        })
    }

    Connect() {
        return new Promise((resolve, reject) => {
            this.connection.connect(err => {
                if (err) {
                    reject(err)
                    return
                }
                console.log("Connected as " + this.connection.threadId)
                this.connected = true
                resolve(true)
            })
        })
    }

    Disconnect() {
        if (this.connected) {
            this.connected = false
            this.connection.end()
        }
    }

    Query(stmt) {
        return new Promise((resolve, reject) => {
            this.connection.query(stmt, (err, res) => {
                if (err) {
                    reject(err)
                    return
                }
                resolve(res)
            })
        })
    }
}

exports.Client = Client;
