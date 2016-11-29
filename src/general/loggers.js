"use strict"

//TODO style of log, style of date, debuglogger

const fs = require('fs')
const winston = require('winston')

function get_latest_filename(filenames) {
    if (filenames.length === 0) {
        return null
    }
    var dates = filenames.map(fn => parseInt(fn.split('.')[0]))
    return Math.max(...dates).toString() + '.log'
}

function add_custom_loggers(fn) {
    winston.loggers.add('controllers', {
        console: {
            level: 'silly',
            colorize: true,
            timestamp: true
        },
        file: {
            level: 'silly',
            json: false,
            name: 'main',
            filename: __dirname+'/../../log/'+fn
        }
    })

    winston.loggers.add('allocations', {
        console: {
            level: 'silly',
            colorize: true,
            timestamp: true
        },
        file: {
            level: 'silly',
            json: false,
            name: 'main',
            filename: __dirname+'/../../log/'+fn
        }
    })

    winston.loggers.add('results', {
        console: {
            level: 'silly',
            colorize: true,
            timestamp: true
        },
        file: {
            level: 'silly',
            json: false,
            name: 'main',
            filename: __dirname+'/../../log/'+fn
        }
    })

    controllers = winston.loggers.get('controllers')
    allocations = winston.loggers.get('allocations')
    results = winston.loggers.get('results')
}

function init() {
    winston.loggers.close()
    var fn = Date.now()+'.log'
    add_custom_loggers(fn)
}

let controllers, allocations, results

var fns = fs.readdirSync(__dirname+'/../../log')
var fn = get_latest_filename(fns)

fn ? add_custom_loggers(fn) : null

function get(name) {
    return winston.loggers.get(name)
}

exports.init = init
exports.controllers = function(a, b) {
    return b ? controllers.log(a, b) : controllers.info(a)
}
exports.allocations = function(a, b) {
    return b ? allocations.log(a, b) : allocations.info(a)
}
exports.results = function(a, b) {
    return b ? results.log(a, b) : results.info(a)
}
