class Request {
    constructor(url) {
        this.url = url
        this.req = new XMLHttpRequest()
        this.data = null
    }

    send() {
        var self = this
        return new Promise((resolve, reject) => {
            self.req.onreadystatechange = () => {
                var DONE = this.DONE || 4
                if (self.req.readyState === DONE) {
                    if (self.req.status === 200) {
                        try {
                            resolve(JSON.parse(self.req.responseText))
                        } catch (err) {
                            reject(err)
                        }
                    } else {
                        reject("response not OK")
                    }
                }
            }
            self.req.send(self.data)
        })
    }
}

class GetRequest extends Request {
    constructor(url) {
        super(url)
        this.req.open("GET", this.url)
        this.req.setRequestHeader("Content-Type", "application/json")
    }
}

class PostRequest extends Request {
    constructor(url) {
        super(url)
        this.req.open("POST", this.url)
        this.req.setRequestHeader("Content-Type", "application/json")
    }

    send(data) {
        this.data = JSON.stringify(data)
        return super.send()
    }
}
