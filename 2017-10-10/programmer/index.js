class Programmer {
    constructor(name, jobTitle, age, favLanguage) {
        this.name = name
        this.jobTitle = jobTitle
        this.age = age
        this.favLanguage = favLanguage
    }

    toString() {
        var props = []
        for (var k in this) {
            props.push(k + ": " + this[k])
        }
        return "(" + props.join(", ") + ")"
    }
}

var knuth = new Programmer("Knuth", "Genius", 60, "APL")

console.log(knuth.toString())
