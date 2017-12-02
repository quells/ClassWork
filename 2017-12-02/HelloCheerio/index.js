const cheerio = require("cheerio")
const request = require("request")

function getHTML(url, cb) {
  request(url, (err, res, html) => {
    if (err != undefined) return cb(err, null)
    if (res.statusCode !== 200) return cb(res.statusMessage, null)

    cb(null, html)
  })
}

// request("https://www.reddit.com/r/webdev", (err, res, html) => {
//   let $ = cheerio.load(html)
//   let results = $("p.title > a").map((i, el) => {
//     return {
//       title: $(el).text(),
//       link: $(el).attr("href")
//     }
//   }).get()
//   console.log(results)
// })

// request("http://www.nytimes.com", (err, res, html) => {
//   if (err != undefined) return console.log(err)
//   if (res.statusCode !== 200) return console.log(res.statusMessage)
//
//   let $ = cheerio.load(html)
//
//   let results = $("h2.story-heading").map((i, el) => {
//     return {
//       title: $(el).children().text().trim(),
//       link: $(el).children().attr("href"),
//     }
//   }).get()
//
//   console.log(results)
// })

getHTML("https://arstechnica.com", (err, html) => {
  if (err !== null) return console.log(err)
  let $ = cheerio.load(html)
  let results = $("article > header > h2").map((i, el) => {
    return {
      title: $(el).text(),
      link: $(el).find("a").attr("href")
    }
  }).get()
  console.log(results)
})
