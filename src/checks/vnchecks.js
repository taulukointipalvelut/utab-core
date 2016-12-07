"use strict"
var sys = require('../allocations/sys.js')
var math = require('../general/math.js')
var vnerrors = require('./errors/vnerrors.js')
var loggers = require('../general/loggers.js')

function error_available(square, venues) {
    var errors = []
    if (!sys.find_one(venues, square.venue).available) {
        errors.push(new vnerrors.ErrorUnavailable(square.venue))
    }
    return errors
}

function check (allocation, venues) {//FOR NA
    loggers.silly_logger(check, arguments, 'checks')
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
