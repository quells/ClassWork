var inq = require("inquirer")

class DigitalPal {
    constructor(name) {
        this.name = name
        this.hungry = false
        this.sleepy = false
        this.bored = true
        this.age = 0
    }

    feed() {
        if (this.hungry) {
            console.log("Thanks, that was yummy!")
            this.hungry = false
            this.sleepy = true
        } else {
            console.log("No thank you, I'm full.")
        }
    }

    sleep() {
        if (this.sleepy) {
            console.log("zzz... ZZZ... zzz...")
            this.sleepy = false
            this.bored = true
            console.log("Good morning!")
            this.increaseAge()
        } else {
            console.log("No way! I'm not tired.")
        }
    }

    play() {
        if (this.bored) {
            console.log("Yay! Let's play!")
            this.bored = false
            this.hungry = true
        } else {
            console.log("Not right now. Maybe later?")
        }
    }

    increaseAge() {
        this.age++
        console.log("Happy birthday to me! I am " + this.age + " days old.")
    }
}

class Dog extends DigitalPal {
    constructor(name) {
        super(name)
        this.outside = false
    }

    bark() {
        console.log("Woof! Woof!")
    }

    play() {
        if (this.outside) {
            this.bark()
            super.play()
        } else {
            console.log("We're not supposed to play indoors...")
        }
    }

    goOutside() {
        if (this.outside) {
            console.log("We're already outside, silly!")
        } else {
            console.log("Yay! I love the outdoors")
            this.outside = true
        }
    }

    goInside() {
        if (this.outside) {
            console.log("Aww, do we have to?")
            this.outside = false
        } else {
            console.log("We're already inside, silly!")
        }
    }
}

class Cat extends DigitalPal {
    constructor(name) {
        super(name)
        this.houseCondition = 100
    }

    meow() {
        console.log("Meow. Meow!")
    }

    play() {
        if (this.destroyFurniture()) {
            super.play()
        }
    }

    destroyFurniture() {
        if (this.houseCondition > 0) {
            console.log("MUAHAHAHA! Take that, furniture!")
            this.houseCondition -= 25
            return true
        } else {
            console.log("All of the furniture is already destroyed.")
            return false
        }
    }

    buyNewFurniture() {
        this.houseCondition += 50
        console.log("Yikes, that was expensive.")
    }
}

function GetName(species) {
    return inq.prompt([{
        type: "input",
        name: "name",
        message: "What do you want to name your " + species + "?"
    }])
}

function DogLoop(dog) {
    inq.prompt([{
        type: "list",
        name: "action",
        message: "What do you want to do with " + dog.name + "?",
        choices: ["Eat", "Sleep", "Play", "Go Outside", "Go Inside", "Quit"],
    }]).then(answers => {
        switch (answers.action) {
            case "Eat":
                dog.feed()
                break
            case "Sleep":
                dog.sleep()
                break
            case "Play":
                dog.play()
                break
            case "Go Outside":
                dog.goOutside()
                break
            case "Go Inside":
                dog.goInside()
                break
            case "Quit":
                console.log("Goodbye!")
                return
        }
        DogLoop(dog)
    })
}

function CatLoop(cat) {
    inq.prompt([{
        type: "list",
        name: "action",
        message: "What do you want to do with " + cat.name + "?",
        choices: ["Eat", "Sleep", "Play", "Buy New Furniture", "Quit"],
    }]).then(answers => {
        switch (answers.action) {
            case "Eat":
                cat.feed()
                break
            case "Sleep":
                cat.sleep()
                break
            case "Play":
                cat.play()
                break
            case "Buy New Furniture":
                cat.buyNewFurniture()
                break
            case "Quit":
                console.log("Goodbye!")
                return
        }
        CatLoop(cat)
    })
}

inq.prompt([{
    type: "list",
    name: "kind",
    message: "What kind of Digital Pal would you like?",
    choices: ["Dog", "Cat"],
}]).then(answers => {
    if (answers.kind === "Dog") {
        GetName("dog").then(answers => {
            DogLoop(new Dog(answers.name))
        })
    } else if (answers.kind === "Cat") {
        GetName("cat").then(answers => {
            CatLoop(new Cat(answers.name))
        })
    } else {
        console.log("Not yet implemented")
    }
})
