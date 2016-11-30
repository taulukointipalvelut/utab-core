class ErrorUnavailable {
    constructor(id) {
        this.id = id
    }
    stringify() {
        return 'Unavailable team '+this.id.toString()+ ' appears'
    }
    shorten() {
        return 'Unavailable'
    }
}

class WarnSided {
    constructor(id, past_sides, sided='government/opposition') {
        this.id = id
        this.past_sides = past_sides
        this.sided = sided
    }
    stringify() {
        return 'Team '+this.id.toString()+' one sided on '+this.sided+' : sides('+this.past_sides.toString()+')'
    }
    shorten() {
        return 'OneSided'
    }
}

class WarnPastOpponent {
    constructor(id, past_opponents) {
        this.id = id
        this.past_opponents = past_opponents
    }
    stringify() {
        return 'Team ' + this.id.toString() + ' matches against the same opponent(s) in the past'+this.past_opponents.toString()
    }
    shorten() {
        return 'PastOpponent'
    }
}

class WarnStrength {
    constructor(wins) {
        this.wins = wins
    }
    stringify() {
        return 'Square with different strength : win(win-points) ('+this.wins.toString()+')'
    }
    shorten() {
        return 'DifferentStrength'
    }
}

class WarnInstitution {
    constructor(id1, id2, institutions1, institutions2) {
        this.id1 = id1
        this.id2 = id2
        this.institutions1 = institutions1
        this.institutions2 = institutions2
    }
    stringify() {
        return 'Institution(s) is the same : team '+this.id1.toString()+' institutions('+this.institutions1.toString()+') vs team '+this.id2.toString()+' institutions('+this.institutions2.toString()+')'
    }
    shorten() {
        return 'SameInstitution'
    }
}

exports.ErrorUnavailable = ErrorUnavailable
exports.WarnSided = WarnSided
exports.WarnPastOpponent = WarnPastOpponent
exports.WarnStrength = WarnStrength
exports.WarnInstitution = WarnInstitution
