"use strict";
var loggers = require('../../general/loggers.js')

class ErrorUnavailable {
    constructor(id) {
        loggers.silly_logger(ErrorUnavailable, arguments, 'checks', __filename)
        this.code = 901
        this.id = id
        this.message = 'Unavailable venue '+this.id.toString()+ ' appears'
        this.name = 'Unavailable'
    }
}

exports.ErrorUnavailable = ErrorUnavailable
