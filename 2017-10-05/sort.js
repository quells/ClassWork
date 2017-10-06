if (process.argv.length < 3) {
    return console.log("Please enter some numbers")
}

var numbers = process.argv.slice(2).map(Number)

function InsertionSort(arr, cmp) {
    for (var i = 1; i < arr.length; i++) {
        var j = i
        while (j > 0 && cmp(arr[j-1], arr[j]) > 0) {
            var tmp = arr[j]
            arr[j] = arr[j-1]
            arr[j-1] = tmp
            j--
        }
    }
    return arr
}

InsertionSort(numbers, (a, b) => a - b).forEach(x => console.log(x))
