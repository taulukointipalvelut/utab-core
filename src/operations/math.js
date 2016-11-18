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


exports.sum = sum
exports.average = average
exports.sd = sd
exports.count = count
exports.count_common = count_common
exports.adjusted_sum = adjusted_sum
exports.adjusted_average = adjusted_average
exports.adjusted_sd = adjusted_sd
