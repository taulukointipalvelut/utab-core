"use strict"
var sys = require('../allocations/sys.js')
var math = require('../general/math.js')

function error_available(square, venues) {
    var errors = []
    if (!venues.filter(v => v.id === square.venue)[0].available) {
        errors.push('ERROR: unavaiable venue appears in the square')
    }
    return errors
}

function check (allocation, venues) {//FOR NA
    var new_allocation = sys.allocation_deepcopy(allocation)
    for (var square of new_allocation) {
        var functions = [error_available]
        for (var func of functions) {
            square.warnings = square.warnings.concat(func(square, venues))
        }
    }
    return new_allocation
}

exports.check = check

//console.log(checks([{venue: 1}], [{id: 1, available: false}]))
