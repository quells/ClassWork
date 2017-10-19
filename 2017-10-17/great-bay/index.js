const inq = require("inquirer")
const Client = require("./mysql_client.js")

class AuctionItem {
    constructor(id, name, category, bid) {
        this.id = id
        this.name = name
        this.category = category
        this.bid = bid
    }

    toString() {
        return `${this.name} (${this.category}): $${this.bid}`
    }
}

function getItems() {
    var client = new Client("auction_db")
    client.CreateConnection()
    return client.Connect()
        .then(function() {
            return client.Query("SELECT id, item_name, category, highest_bid FROM auctions")
        })
        .then(function(results) {
            return results.map(r => new AuctionItem(r.id, r.item_name, r.category, r.highest_bid))
        })
        .catch(console.error)
        .then(function(results) {
            client.Disconnect()
            return results
        })
}

function promptUserToChooseItem(items) {
    var itemDescs = items.map(i => i.toString())
    inq.prompt([{
        type: "list",
        name: "itemName",
        message: "Bid on an item:",
        choices: itemDescs
    }])
    .then(answer => {
        var i = itemDescs.indexOf(answer.itemName)
        promptUserForBidPrice(items, i)
    })
}

function promptUserForBidPrice(items, index) {
    inq.prompt([{
        type: "input",
        name: "bidAmount",
        message: "Amount to bid:",
        validate: function(value) {
            return Number(value) > 0
        }
    }])
    .then(answer => {
        var bidAmount = Number(Number(answer.bidAmount).toFixed(2))
        var item = items[index]
        var p = Promise.resolve()
        if (bidAmount > item.bid) {
            console.log("You have the new high bid!")
            p = p.then(() => {
                var client = new Client("auction_db")
                client.CreateConnection()
                return client.Connect()
                .then(() => client.Query(`UPDATE auctions SET highest_bid = ${bidAmount} WHERE id = ${item.id}`))
                .catch(console.error)
                .then(() => client.Disconnect())
            })
        } else {
            console.log("That bid was not high enough.")
        }
        p = p.then(() => {
            start()
        })
    })
}

function start() {
    getItems()
    .then(function(items) {
        promptUserToChooseItem(items)
    })
}

start()
