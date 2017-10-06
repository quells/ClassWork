if (process.argv.length < 3) {
    return console.log("Please enter some numbers")
}

var numbers = process.argv.slice(2).map(Number)

function InsertionSort(arr, cmp) {
    var copy = arr.slice(0)
    for (var i = 1; i < copy.length; i++) {
        var j = i
        while (j > 0 && cmp(copy[j-1], copy[j]) > 0) {
            var tmp = copy[j]
            copy[j] = copy[j-1]
            copy[j-1] = tmp
            j--
        }
    }
    return copy
}

InsertionSort(numbers, (a, b) => a - b).forEach(x => console.log(x))
