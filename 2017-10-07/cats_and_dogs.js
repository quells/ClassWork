class Animal {
    constructor(name, species) {
        this.name = name
        this.species = species
        this.raining = false
        this.noise = "Huh?"
    }
    makeNoise() {
        if (this.raining) {
            console.log(this.name + " says " + this.noise)
        }
    }
}

class Dog extends Animal {
    constructor(name) {
        super(name, "Dog")
        this.noise = "Woof!"
    }
}

class Cat extends Animal {
    constructor(name) {
        super(name, "Cat")
        this.noise = "Meow."
    }
}

function contains(str, substr) {
    return str.indexOf(substr) > -1
}

function massHysteria(cat, dog) {
    if (cat.raining && dog.raining) {
        console.log("CATS AND DOGS LIVING TOGETHER! MASS HYSTERIA!!!")
    }
}

var garfield = new Cat("Garfield")
var odie = new Dog("Odie")

var args = process.argv.slice(2).join(" ")
if (contains(args, "cat")) { garfield.raining = true }
if (contains(args, "dog")) { odie.raining = true }

garfield.makeNoise()
odie.makeNoise()
massHysteria(garfield, odie)
