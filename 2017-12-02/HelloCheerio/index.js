const cheerio = require("cheerio")
const request = require("request")

request("https://www.reddit.com/r/webdev", (err, res, html) => {
  let $ = cheerio.load(html)
  let results = $("p.title > a").map((i, el) => {
    return {
      title: $(el).text(),
      link: $(el).attr("href")
    }
  }).get()
  console.log(results)
})
