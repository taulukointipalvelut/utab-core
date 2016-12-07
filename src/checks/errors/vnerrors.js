"use strict";
var loggers = require('../../general/loggers.js')

class ErrorUnavailable {
    constructor(id) {
        loggers.silly_logger(ErrorUnavailable, arguments, 'checks')
        this.code = 901
        this.id = id
        this.text = 'Unavailable venue '+this.id.toString()+ ' appears'
        this.msg = 'Unavailable'
    }
}

exports.ErrorUnavailable = ErrorUnavailable
