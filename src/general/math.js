function sum(list) {//TESTED//
    return list.reduce((a, b) => a + b, 0)
}

function average(list) {//TESTED//
    return list.length === 0 ? 0 : sum(list)/list.length
}

function sd(list) {//TESTED//
    var avr = average(list)
    return Math.sqrt(average(list.map(x => Math.pow(x - avr, 2))))
}

function count(list, e) {//TESTED//
    return list.filter(l => e === l).length
}

function count_common(list1, list2) {//TESTED//
    return sum(list1.map(e1 => count(list2, e1)))
}

function adjusted_sum(list) {//TESTED//
    return sum(list.filter(x => x !== null))
}

function adjusted_average(list) {//TESTED//
    return average(list.filter(x => x !== null))
}

function adjusted_sd(list) {//TESTED//
    return sd(list.filter(x => x !== null))
}

function isin(e, list) {
    for (var l of list) {
        if (l === e) {
            return true
        }
    }
    return false
}

function subset(list0, list1) {
    for (var e of list0) {
        if (!isin(e, list1)) {
            return false
        }
    }
    return true
}

function shuffle (list) {
    var array = [].concat(list)
    var n = array.length
    var t
    var i

    while (n) {
        i = Math.floor(Math.random() * n--)
        t = array[n]
        array[n] = array[i]
        array[i] = t
    }
    return array
}

exports.sum = sum
exports.average = average
exports.sd = sd
exports.count = count
exports.count_common = count_common
exports.adjusted_sum = adjusted_sum
exports.adjusted_average = adjusted_average
exports.adjusted_sd = adjusted_sd
exports.subset = subset
exports.isin = isin
exports.shuffle = shuffle
