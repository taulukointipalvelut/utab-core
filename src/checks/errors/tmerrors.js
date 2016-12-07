"use strict";
var loggers = require('../../general/loggers.js')

class ErrorUnavailable {
    constructor(id) {
        loggers.silly_logger(ErrorUnavailable, arguments, 'checks', __filename)
        this.code = 601
        this.id = id
        this.text = 'Unavailable team '+this.id.toString()+ ' appears'
        this.msg = 'Unavailable'
    }
}

class WarnSided {
    constructor(id, past_sides, sided='government/opposition') {
        loggers.silly_logger(WarnSided, arguments, 'checks', __filename)
        this.code = 602
        this.id = id
        this.past_sides = past_sides
        this.sided = sided
        this.text = 'Team '+this.id.toString()+' one sided on '+this.sided+' : sides('+this.past_sides.toString()+')'
        this.msg = 'OneSided'
    }
}

class WarnPastOpponent {
    constructor(id, past_opponents) {
        loggers.silly_logger(WarnPastOpponent, arguments, 'checks', __filename)
        this.code = 603
        this.id = id
        this.past_opponents = past_opponents
        this.text = 'Team ' + this.id.toString() + ' matches against the same opponent(s) in the past'+this.past_opponents.toString()
        this.msg = 'PastOpponent'
    }
}

class WarnStrength {
    constructor(wins) {
        loggers.silly_logger(WarnStrength, arguments, 'checks', __filename)
        this.code = 604
        this.wins = wins
        this.text = 'Square with different strength : win(win-points) ('+this.wins.toString()+')'
        this.msg = 'DifferentStrength'
    }
}

class WarnInstitution {
    constructor(id1, id2, institutions1, institutions2) {
        loggers.silly_logger(WarnInstitution, arguments, 'checks', __filename)
        this.code = 605
        this.id1 = id1
        this.id2 = id2
        this.institutions1 = institutions1
        this.institutions2 = institutions2
        this.text = 'Institution(s) is the same : team '+this.id1.toString()+' institutions('+this.institutions1.toString()+') vs team '+this.id2.toString()+' institutions('+this.institutions2.toString()+')'
        this.msg = 'SameInstitution'
    }
}

exports.ErrorUnavailable = ErrorUnavailable
exports.WarnSided = WarnSided
exports.WarnPastOpponent = WarnPastOpponent
exports.WarnStrength = WarnStrength
exports.WarnInstitution = WarnInstitution
