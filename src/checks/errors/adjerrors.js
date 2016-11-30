class ErrorUnavailable {
    constructor(id) {
        this.id = id
    }
    stringify() {
        return 'Unavailable adjudicator '+this.id.toString()+ ' appears'
    }
    shorten() {
        return 'Unavailable'
    }
}

class WarnStrength {
    constructor(id, adjudicator_ranking, average_team_ranking) {
        this.id = id
        this.adjudicator_ranking = adjudicator_ranking
        this.average_team_ranking = average_team_ranking
    }
    stringify() {
        return 'Inappropriate adjudicator '+this.id.toString()+' will judge teams : adjudicator_ranking(' + this.adjudicator_ranking.toString() + ') vs average team ranking(' + this.average_team_ranking.toString()+')'
    }
    shorten() {
        return 'StrengthDifferent'
    }
}

class WarnInstitution {
    constructor(id, adjudicator_institutions, team_institutions) {
        this.id = id
        this.adjudicator_institutions = adjudicator_institutions
        this.team_institutions = team_institutions
    }
    stringify() {
        return 'Institution conflict at adjudicator '+this.id.toString()+' : teams institution('+this.team_institutions.toString()+') vs adjudicator institution('+this.adjudicator_institutions.toString()+')'
    }
    shorten() {
        return 'InstitutionConflict'
    }
}

class WarnConflict {
    constructor(id, adjudicator_conflicts, teams) {
        this.id = id
        this.adjudicator_conflicts = adjudicator_conflicts
        this.teams = teams
    }
    stringify() {
        return 'Personal conflict at adjudicator '+this.id.toString()+' : teams('+this.teams.toString()+') vs adjudicator conflict('+this.adjudicator_conflicts.toString()+')'
    }
    shorten() {
        return 'PersonalConflict'
    }
}

class AlreadyJudged {
    constructor(id, judged_teams, teams) {
        this.id = id
        this.judged_teams = judged_teams
        this.teams = teams
    }
    stringify() {
        return 'Adjudicator has already judged the teams in the past : judged teams('+this.judged_teams.toString()+') vs teams('+this.teams.toString()+')'
    }
    shorten() {
        return 'AlreadyJudged'
    }
}

exports.ErrorUnavailable = ErrorUnavailable
exports.WarnStrength = WarnStrength
exports.WarnInstitution = WarnInstitution
exports.WarnConflict = WarnConflict
exports.AlreadyJudged = AlreadyJudged
