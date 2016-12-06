"use strict";
class ErrorUnavailable {
    constructor(id) {
        this.code = 901
        this.id = id
        this.text = 'Unavailable venue '+this.id.toString()+ ' appears'
        this.msg = 'Unavailable'
    }
}

exports.ErrorUnavailable = ErrorUnavailable
